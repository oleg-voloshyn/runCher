module Api
  module V1
    class ActivitiesController < BaseController
      # POST /api/v1/sync_activities
      # Fetches recent activities from Strava and enqueues processing jobs.
      SYNC_COOLDOWN = 6.hours

      def sync
        next_sync_at = current_user.last_synced_at && current_user.last_synced_at + SYNC_COOLDOWN
        if next_sync_at && next_sync_at > Time.current
          return render json: {
            message:     "Наступна синхронізація доступна о #{next_sync_at.in_time_zone('Kyiv').strftime('%H:%M')}",
            next_sync_at: next_sync_at
          }
        end

        current_user.ensure_fresh_token!
        client = Strava::Api::Client.new(access_token: current_user.access_token)

        # First sync: start from earliest active tournament the user participates in.
        # Subsequent syncs: start from last_synced_at to avoid re-fetching old data.
        after_time = if current_user.last_synced_at
          current_user.last_synced_at
        else
          Tournament
            .joins(:tournament_participants)
            .where(status: 'active', tournament_participants: { user_id: current_user.id })
            .minimum(:starts_at) || 30.days.ago
        end

        activities = client.athlete_activities(per_page: 200, after: after_time.to_i)
        enqueued = 0

        activities.each do |a|
          activity_type = a.respond_to?(:sport_type) ? a.sport_type : a['type']
          next unless activity_type == 'Run'
          next if Activity.exists?(strava_activity_id: a['id'].to_s)

          SyncStravaActivityJob.perform_later(current_user.id, a['id'].to_s)
          enqueued += 1
        end

        current_user.update_column(:last_synced_at, Time.current)
        new_next_sync_at = current_user.last_synced_at + SYNC_COOLDOWN

        render json: {
          message:      "Синхронізується #{enqueued} нових активностей",
          next_sync_at: new_next_sync_at
        }
      rescue Strava::Errors::Fault => e
        render json: { error: e.message }, status: :unprocessable_entity
      rescue StandardError => e
        Rails.logger.error "Sync failed for user #{current_user.id}: #{e.class}: #{e.message}"
        render json: { error: e.message }, status: :internal_server_error
      end
    end
  end
end

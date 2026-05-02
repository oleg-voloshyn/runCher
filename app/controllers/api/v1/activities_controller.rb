module Api
  module V1
    class ActivitiesController < BaseController
      # POST /api/v1/sync_activities
      # Fetches recent activities from Strava and enqueues processing jobs.
      def sync
        current_user.ensure_fresh_token!
        client = Strava::Api::Client.new(access_token: current_user.access_token)

        activities = client.athlete_activities(per_page: 30)
        enqueued = 0

        activities.each do |a|
          activity_type = a.respond_to?(:sport_type) ? a.sport_type : a['type']
          next unless activity_type == 'Run'

          unless Activity.exists?(strava_activity_id: a['id'].to_s)
            SyncStravaActivityJob.perform_later(current_user.id, a['id'].to_s)
            enqueued += 1
          end
        end

        render json: { message: "Syncing #{enqueued} new activities" }
      rescue Strava::Errors::Fault => e
        render json: { error: e.message }, status: :unprocessable_entity
      rescue StandardError => e
        Rails.logger.error "Sync failed for user #{current_user.id}: #{e.class}: #{e.message}"
        render json: { error: e.message }, status: :internal_server_error
      end
    end
  end
end

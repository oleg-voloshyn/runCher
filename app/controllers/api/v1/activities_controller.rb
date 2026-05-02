module Api
  module V1
    class ActivitiesController < BaseController
      SYNC_COOLDOWN = 6.hours

      def index
        activities = current_user.activities
          .where(processed: true)
          .order(start_date: :desc)
          .limit(50)
          .includes(:segment_efforts)

        render json: activities.map { |a|
          {
            id:                     a.id,
            name:                   a.name,
            start_date:             a.start_date,
            distance:               a.distance,
            elapsed_time:           a.elapsed_time,
            matched_segments_count: a.segment_efforts.size
          }
        }
      end

      def sync
        unless current_user.admin?
          next_sync_at = current_user.last_synced_at && current_user.last_synced_at + SYNC_COOLDOWN
          if next_sync_at && next_sync_at > Time.current
            return render json: {
              message:     "Наступна синхронізація доступна о #{next_sync_at.in_time_zone('Kyiv').strftime('%H:%M')}",
              next_sync_at: next_sync_at
            }
          end
        end

        current_user.ensure_fresh_token!
        client = Strava::Api::Client.new(access_token: current_user.access_token)

        tournament_start = Tournament
          .joins(:tournament_participants)
          .where(status: 'active', tournament_participants: { user_id: current_user.id })
          .minimum(:starts_at) || 30.days.ago

        after_time = if current_user.last_synced_at && current_user.activities.where(processed: true).exists?
          current_user.last_synced_at
        else
          tournament_start
        end

        summary_list = client.athlete_activities(per_page: 200, after: after_time.to_i)

        all_types = summary_list.map { |a| a.respond_to?(:sport_type) ? a.sport_type.to_s : a['type'].to_s }
        Rails.logger.info "Sync user=#{current_user.id} after=#{after_time} total=#{summary_list.size} types=#{all_types.tally}"

        run_ids = summary_list.filter_map do |a|
          activity_type = a.respond_to?(:sport_type) ? a.sport_type.to_s : a['type'].to_s
          next if activity_type != 'Run'
          next if Activity.exists?(strava_activity_id: a['id'].to_s, processed: true)
          a['id'].to_s
        end

        processed_count = 0
        debug_info = { after_time: after_time, total_from_strava: summary_list.size, activity_types: all_types.tally, run_ids_count: run_ids.size }

        run_ids.each do |strava_id|
          detail = client.activity(strava_id)

          activity = Activity.find_or_initialize_by(strava_activity_id: strava_id)
          unless activity.persisted?
            activity.assign_attributes(
              user:          current_user,
              name:          detail['name'],
              activity_type: detail['type'],
              start_date:    detail['start_date'],
              elapsed_time:  detail['elapsed_time'],
              distance:      detail['distance']
            )
            activity.save!
          end

          Array(detail['segment_efforts']).each do |effort_data|
            segment = Segment.find_by(strava_id: effort_data['segment']['id'].to_s)
            next unless segment

            SegmentEffort.find_or_create_by(strava_effort_id: effort_data['id'].to_s) do |e|
              e.user         = current_user
              e.segment      = segment
              e.activity     = activity
              e.elapsed_time = effort_data['elapsed_time']
              e.start_date   = effort_data['start_date']
            end
          end

          activity.update_column(:processed, true)
          processed_count += 1
        rescue Strava::Errors::Fault => e
          Rails.logger.error "Failed to fetch activity #{strava_id}: #{e.message}"
          next
        end

        current_user.update_column(:last_synced_at, Time.current)
        new_next_sync_at = current_user.last_synced_at + SYNC_COOLDOWN

        render json: {
          message:     "Знайдено #{processed_count} нових пробіжок",
          next_sync_at: new_next_sync_at,
          debug:        debug_info
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

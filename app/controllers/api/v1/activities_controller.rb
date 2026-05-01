module Api
  module V1
    class ActivitiesController < BaseController
      # POST /api/v1/sync_activities
      # Fetches recent activities from Strava and enqueues processing jobs.
      def sync
        current_user.ensure_fresh_token!
        client = Strava::Api::Client.new(access_token: current_user.access_token)

        # Fetch last 30 activities (enough for any active tournament window)
        activities = client.athlete_activities(per_page: 30)
        enqueued = 0

        activities.each do |a|
          next unless a['type'] == 'Run'

          unless Activity.exists?(strava_activity_id: a['id'].to_s)
            SyncStravaActivityJob.perform_later(current_user.id, a['id'].to_s)
            enqueued += 1
          end
        end

        render json: { message: "Syncing #{enqueued} new activities" }
      rescue Strava::Errors::Fault => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end
end

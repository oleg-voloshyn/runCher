class SyncStravaActivityJob < ApplicationJob
  queue_as :default

  def perform(user_id, strava_activity_id)
    user = User.find_by(id: user_id)
    return unless user

    user.ensure_fresh_token!

    client = Strava::Api::Client.new(access_token: user.access_token)
    data   = client.activity(strava_activity_id)

    activity = Activity.sync_from_strava(user, data)
    return unless activity  # already processed

    # Pull segment efforts from the activity detail
    Array(data['segment_efforts']).each do |effort_data|
      segment = Segment.find_by(strava_id: effort_data['segment']['id'].to_s)
      next unless segment

      SegmentEffort.find_or_create_by(strava_effort_id: effort_data['id'].to_s) do |e|
        e.user         = user
        e.segment      = segment
        e.activity     = activity
        e.elapsed_time = effort_data['elapsed_time']
        e.start_date   = effort_data['start_date']
      end
    end

    activity.update!(processed: true)
  rescue Strava::Errors::Fault => e
    Rails.logger.error "SyncStravaActivityJob failed for user #{user_id}, activity #{strava_activity_id}: #{e.message}"
  end
end

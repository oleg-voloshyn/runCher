class SyncStravaActivityJob < ApplicationJob
  queue_as :default

  def perform(user_id, strava_activity_id)
    user = User.find_by(id: user_id)
    return unless user

    existing = Activity.find_by(strava_activity_id: strava_activity_id)
    return if existing&.processed?

    user.ensure_fresh_token!
    client = Strava::Api::Client.new(access_token: user.access_token)
    detail = client.activity(strava_activity_id)

    activity = existing || Activity.new(strava_activity_id: strava_activity_id)
    unless activity.persisted?
      activity.assign_attributes(
        user:          user,
        name:          detail.name,
        activity_type: detail.respond_to?(:sport_type) ? detail.sport_type.to_s : detail.type.to_s,
        start_date:    detail.start_date,
        elapsed_time:  detail.elapsed_time,
        distance:      detail.distance
      )
      activity.save!
    end

    Array(detail.segment_efforts).each do |effort_data|
      segment = Segment.find_by(strava_id: effort_data.segment.id.to_s)
      next unless segment

      SegmentEffort.find_or_create_by(strava_effort_id: effort_data.id.to_s) do |e|
        e.user         = user
        e.segment      = segment
        e.activity     = activity
        e.elapsed_time = effort_data.elapsed_time
        e.start_date   = effort_data.start_date
      end
    end

    activity.update!(processed: true)
  rescue Strava::Errors::Fault => e
    Rails.logger.error "SyncStravaActivityJob failed (Strava) for user #{user_id}, activity #{strava_activity_id}: #{e.message}"
  rescue StandardError => e
    Rails.logger.error "SyncStravaActivityJob failed for user #{user_id}, activity #{strava_activity_id}: #{e.class}: #{e.message}"
    raise
  end
end

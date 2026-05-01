class ProcessSegmentEffortJob < ApplicationJob
  queue_as :default

  def perform(segment_effort_id)
    effort = SegmentEffort.find_by(id: segment_effort_id)
    return unless effort

    TournamentScore.process_effort(effort)
  end
end

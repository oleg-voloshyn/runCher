class SegmentEffort < ApplicationRecord
  belongs_to :user
  belongs_to :segment
  belongs_to :activity

  validates :strava_effort_id, presence: true, uniqueness: true
  validates :elapsed_time, presence: true, numericality: { only_integer: true, greater_than: 0 }

  after_create :update_tournament_scores

  private

  def update_tournament_scores
    ProcessSegmentEffortJob.perform_later(id)
  end
end

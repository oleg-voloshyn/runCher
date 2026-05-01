class TournamentParticipant < ApplicationRecord
  belongs_to :tournament
  belongs_to :user

  GENDERS = %w[male female].freeze

  validates :user_id,  uniqueness: { scope: :tournament_id }
  validates :gender,   presence: true, inclusion: { in: GENDERS }
  validates :total_score, :bonus_score, numericality: { greater_than_or_equal_to: 0 }

  def overall_score
    total_score + bonus_score
  end

  # Called when participant finishes all rated segments in correct order.
  # finishers_count = how many people finished before this participant
  def award_bonus!(finishers_count)
    place = finishers_count + 1
    bonus = place <= 10 ? (tournament.users.count * (11 - place)) : 0
    update!(
      completion_order: place,
      completed_at:     Time.current,
      bonus_score:      bonus
    )
  end
end

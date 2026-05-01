class Tournament < ApplicationRecord
  belongs_to :created_by, class_name: 'User'
  has_many :tournament_segments, dependent: :destroy
  has_many :segments, through: :tournament_segments
  has_many :tournament_participants, dependent: :destroy
  has_many :users, through: :tournament_participants
  has_many :tournament_scores, dependent: :destroy

  STATUSES = %w[draft active completed].freeze

  validates :name, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :total_segments_count, :rated_segments_count,
            presence: true, numericality: { only_integer: true, greater_than: 0 }
  validate  :rated_count_within_total

  scope :active,    -> { where(status: 'active') }
  scope :completed, -> { where(status: 'completed') }
  scope :visible,   -> { where(status: %w[active completed]) }

  def rated_tournament_segments
    tournament_segments.where(is_rated: true).order(:order_number)
  end

  def all_tournament_segments
    tournament_segments.includes(:segment)
  end

  def participant_for(user)
    tournament_participants.find_by(user: user)
  end

  def activate!
    update!(status: 'active')
  end

  def complete!
    update!(status: 'completed')
    TournamentScore.recalculate_all(self)
  end

  private

  def rated_count_within_total
    return unless rated_segments_count && total_segments_count
    if rated_segments_count > total_segments_count
      errors.add(:rated_segments_count, "cannot exceed total segments count")
    end
  end
end

class TournamentSegment < ApplicationRecord
  belongs_to :tournament
  belongs_to :segment

  validates :segment_id, uniqueness: { scope: :tournament_id }
  validates :order_number, presence: true, numericality: { only_integer: true, greater_than: 0 }, if: :is_rated?
  validates :order_number, uniqueness: { scope: :tournament_id }, if: :is_rated?
end

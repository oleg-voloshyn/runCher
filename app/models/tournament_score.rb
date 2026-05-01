class TournamentScore < ApplicationRecord
  belongs_to :tournament
  belongs_to :user
  belongs_to :segment
  belongs_to :segment_effort

  validates :segment_id, uniqueness: { scope: [:tournament_id, :user_id] }
  validates :elapsed_time, presence: true, numericality: { only_integer: true, greater_than: 0 }

  # Called after a new SegmentEffort is saved.
  # Finds all active tournaments that include this segment, updates the
  # participant's best score for it, then recalculates points for everyone
  # in case the segment leader changed.
  def self.process_effort(effort)
    active_tournament_segments = TournamentSegment
      .joins(:tournament)
      .where(segment: effort.segment, tournaments: { status: 'active' })
      .where('tournaments.starts_at <= ? AND (tournaments.ends_at IS NULL OR tournaments.ends_at >= ?)', Time.current, Time.current)
      .includes(:tournament)

    active_tournament_segments.each do |ts|
      tournament = ts.tournament
      participant = tournament.participant_for(effort.user)
      next unless participant

      upsert_best_effort(tournament, effort, participant.gender)
    end
  end

  # Insert or replace participant's score for this segment if the new effort is faster.
  def self.upsert_best_effort(tournament, effort, gender)
    existing = find_by(tournament: tournament, user: effort.user, segment: effort.segment)

    if existing.nil? || effort.elapsed_time < existing.elapsed_time
      transaction do
        if existing
          existing.update!(elapsed_time: effort.elapsed_time, segment_effort: effort)
        else
          create!(
            tournament:     tournament,
            user:           effort.user,
            segment:        effort.segment,
            segment_effort: effort,
            elapsed_time:   effort.elapsed_time
          )
        end

        recalculate_segment_scores(tournament, effort.segment, gender)
        recalculate_participant_totals(tournament, gender)
        check_completion(tournament, effort.user)
      end
    end
  end

  # Score formula: (fastest_time / player_time) * 100  — per gender
  def self.recalculate_segment_scores(tournament, segment, gender)
    scores = joins(:user)
      .joins("INNER JOIN tournament_participants ON tournament_participants.user_id = tournament_scores.user_id AND tournament_participants.tournament_id = tournament_scores.tournament_id")
      .where(tournament: tournament, segment: segment)
      .where(tournament_participants: { gender: gender })

    best_time = scores.minimum(:elapsed_time)
    return if best_time.nil?

    scores.each do |s|
      s.update_column(:score, (best_time.to_f / s.elapsed_time) * 100)
    end
  end

  # Recompute total_score for each participant from their individual segment scores.
  def self.recalculate_participant_totals(tournament, gender)
    tournament.tournament_participants.where(gender: gender).each do |participant|
      total = where(tournament: tournament, user: participant.user).sum(:score)
      participant.update_column(:total_score, total)
    end
  end

  # Check if a participant has completed all rated segments in order.
  def self.check_completion(tournament, user)
    participant = tournament.participant_for(user)
    return if participant.nil? || participant.completion_order.present?

    rated_ts = tournament.rated_tournament_segments.to_a
    return if rated_ts.empty?

    # User must have a score for every rated segment
    completed_segment_ids = where(tournament: tournament, user: user).pluck(:segment_id)
    rated_segment_ids = rated_ts.map(&:segment_id)
    return unless (rated_segment_ids - completed_segment_ids).empty?

    # All rated segments completed — award bonus based on current finisher count
    finishers_count = tournament.tournament_participants
                                .where.not(completion_order: nil)
                                .count
    participant.award_bonus!(finishers_count)
  end

  # Full recalculation for all genders (called on tournament.complete!)
  def self.recalculate_all(tournament)
    %w[male female].each do |gender|
      tournament.segments.each do |segment|
        recalculate_segment_scores(tournament, segment, gender)
      end
      recalculate_participant_totals(tournament, gender)
    end
  end
end

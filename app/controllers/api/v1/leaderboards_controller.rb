module Api
  module V1
    class LeaderboardsController < BaseController
      skip_before_action :authenticate_user!, only: [:show]

      def show
        tournament = Tournament.find_by(slug: params[:tournament_id]) || Tournament.find_by(id: params[:tournament_id])
        return render json: { error: 'Tournament not found' }, status: :not_found unless tournament
        gender = params[:gender]

        participants = tournament.tournament_participants
        participants = participants.where(gender: gender) if gender.present?
        participants = participants
          .includes(:user)
          .order(Arel.sql('(total_score + bonus_score) DESC'), :completion_order)

        # Segment leaderboard (best efforts per segment, by gender)
        segment_leaders = build_segment_leaders(tournament, gender)

        render json: {
          tournament_id: tournament.id,
          gender_filter: gender,
          rankings:      participants.map.with_index(1) { |p, rank| participant_rank_json(p, rank) },
          segment_leaders: segment_leaders
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Tournament not found' }, status: :not_found
      end

      private

      def build_segment_leaders(tournament, gender)
        # Rated segments only, reveal order to everyone on leaderboard page
        rated = tournament.rated_tournament_segments.includes(:segment)

        rated.map do |ts|
          scores = TournamentScore.joins(:user)
            .joins("INNER JOIN tournament_participants ON tournament_participants.user_id = tournament_scores.user_id AND tournament_participants.tournament_id = tournament_scores.tournament_id")
            .where(tournament: tournament, segment: ts.segment)
            .then { |q| gender.present? ? q.where(tournament_participants: { gender: gender }) : q }
            .order(:elapsed_time)
            .first

          {
            order_number:  ts.order_number,
            segment_id:    ts.segment.id,
            segment_name:  ts.segment.name,
            leader: scores ? {
              user_id:      scores.user_id,
              full_name:    scores.user.full_name,
              elapsed_time: scores.elapsed_time,
              score:        scores.score.to_f.round(2)
            } : nil
          }
        end
      end

      def participant_rank_json(p, rank)
        {
          rank:             rank,
          user_id:          p.user_id,
          full_name:        p.user.full_name,
          profile_picture:  p.user.profile_picture,
          gender:           p.gender,
          total_score:      p.total_score.to_f.round(2),
          bonus_score:      p.bonus_score.to_f.round(2),
          overall_score:    p.overall_score.to_f.round(2),
          completion_order: p.completion_order,
          completed_at:     p.completed_at
        }
      end
    end
  end
end

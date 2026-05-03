module Api
  module V1
    class TournamentsController < BaseController
      skip_before_action :authenticate_user!, only: [:index, :show]
      before_action :set_tournament, only: [:show, :update, :destroy, :join, :leave, :activate, :complete]
      before_action :require_moderator!, only: [:create, :update, :destroy, :activate, :complete]

      def index
        tournaments = current_user&.admin? ? Tournament.all : Tournament.visible
        render json: tournaments.order(created_at: :desc).map { |t| tournament_json(t) }
      end

      def show
        render json: tournament_json(@tournament, detail: true)
      end

      def create
        tournament = Tournament.new(tournament_params.merge(created_by: current_user))
        if tournament.save
          render json: tournament_json(tournament), status: :created
        else
          render json: { errors: tournament.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @tournament.update(tournament_params)
          render json: tournament_json(@tournament)
        else
          render json: { errors: @tournament.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @tournament.destroy
        head :no_content
      end

      def join
        if @tournament.status != 'active'
          return render json: { error: 'Tournament is not active' }, status: :unprocessable_entity
        end

        participant = @tournament.tournament_participants.find_or_initialize_by(user: current_user)
        if participant.new_record?
          participant.gender = current_user.gender
          participant.save!
          render json: { message: 'Joined tournament' }, status: :created
        else
          render json: { error: 'Already joined' }, status: :unprocessable_entity
        end
      end

      def leave
        participant = @tournament.participant_for(current_user)
        if participant
          participant.destroy
          head :no_content
        else
          render json: { error: 'Not a participant' }, status: :not_found
        end
      end

      def activate
        @tournament.activate!
        render json: tournament_json(@tournament)
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      end

      def complete
        @tournament.complete!
        render json: tournament_json(@tournament)
      end

      private

      def set_tournament
        @tournament = Tournament.find_by(slug: params[:id]) || Tournament.find_by(id: params[:id])
        render json: { error: 'Tournament not found' }, status: :not_found unless @tournament
      end

      def tournament_params
        params.require(:tournament).permit(
          :name, :description, :starts_at, :ends_at,
          :total_segments_count, :rated_segments_count
        )
      end

      def tournament_json(t, detail: false)
        json = {
          id:                    t.id,
          slug:                  t.slug,
          name:                  t.name,
          description:           t.description,
          status:                t.status,
          starts_at:             t.starts_at,
          ends_at:               t.ends_at,
          total_segments_count:  t.total_segments_count,
          rated_segments_count:  t.rated_segments_count,
          participants_count:    t.tournament_participants.size,
          joined:                current_user ? t.participant_for(current_user).present? : false
        }

        if detail
          # A segment is "revealed" once any participant has a score for it in this tournament.
          # Until then, regular users don't know whether it's rated or not.
          revealed_ids = t.tournament_scores.distinct.pluck(:segment_id).to_set

          json[:segments] = t.all_tournament_segments.map do |ts|
            seg = ts.segment
            show_rated = current_user&.moderator? || revealed_ids.include?(seg.id)
            {
              id:              seg.id,
              strava_id:       seg.strava_id,
              name:            seg.name,
              distance:        seg.distance,
              average_grade:   seg.average_grade,
              start_latitude:  seg.start_latitude,
              start_longitude: seg.start_longitude,
              end_latitude:    seg.end_latitude,
              end_longitude:   seg.end_longitude,
              polyline:        seg.polyline,
              is_rated:        show_rated ? ts.is_rated : nil,
              order_number:    show_rated ? ts.order_number : nil
            }.compact
          end
        end

        json
      end
    end
  end
end

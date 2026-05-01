module Api
  module V1
    class TournamentSegmentsController < BaseController
      before_action :require_moderator!
      before_action :set_tournament

      def index
        ts = @tournament.tournament_segments.includes(:segment).order(:order_number, :id)
        render json: ts.map { |s| ts_json(s) }
      end

      def create
        ts = @tournament.tournament_segments.new(ts_params)
        if ts.save
          render json: ts_json(ts), status: :created
        else
          render json: { errors: ts.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        ts = @tournament.tournament_segments.find(params[:id])
        ts.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Not found' }, status: :not_found
      end

      private

      def set_tournament
        @tournament = Tournament.find(params[:tournament_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Tournament not found' }, status: :not_found
      end

      def ts_params
        params.require(:tournament_segment).permit(:segment_id, :is_rated, :order_number)
      end

      def ts_json(ts)
        {
          id:           ts.id,
          segment_id:   ts.segment_id,
          segment_name: ts.segment.name,
          is_rated:     ts.is_rated,
          order_number: ts.order_number
        }
      end
    end
  end
end

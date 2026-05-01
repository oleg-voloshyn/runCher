module Admin
  class TournamentSegmentsController < BaseController
    before_action :set_tournament

    def create
      ts = @tournament.tournament_segments.new(ts_params)
      if ts.save
        redirect_to admin_tournament_path(@tournament), notice: "Сегмент «#{ts.segment.name}» додано"
      else
        redirect_to admin_tournament_path(@tournament), alert: ts.errors.full_messages.join(', ')
      end
    end

    def destroy
      ts = @tournament.tournament_segments.find(params[:id])
      ts.destroy
      redirect_to admin_tournament_path(@tournament), notice: 'Сегмент видалено з турніру'
    end

    private

    def set_tournament
      @tournament = Tournament.find(params[:tournament_id])
    end

    def ts_params
      params.require(:tournament_segment).permit(:segment_id, :is_rated, :order_number)
    end
  end
end

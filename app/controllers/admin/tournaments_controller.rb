module Admin
  class TournamentsController < BaseController
    before_action :set_tournament, only: [:show, :edit, :update, :destroy, :activate, :complete]

    def index
      @tournaments = Tournament.includes(:created_by, :tournament_participants)
                               .order(created_at: :desc)
    end

    def show
      @tournament_segments  = @tournament.tournament_segments.includes(:segment).order(:is_rated, :order_number)
      @participants         = @tournament.tournament_participants.includes(:user).order(:gender, completion_order: :asc)
      existing_ids          = @tournament_segments.map(&:segment_id)
      @available_segments   = Segment.where.not(id: existing_ids).order(:name)
      participant_user_ids  = @participants.map(&:user_id)
      @available_users      = User.where.not(id: participant_user_ids).order(:first_name, :last_name)
    end

    def new
      @tournament = Tournament.new
    end

    def create
      @tournament = Tournament.new(tournament_params.merge(created_by: current_user))
      if @tournament.save
        redirect_to admin_tournament_path(@tournament), notice: 'Турнір створено'
      else
        render :new, status: :unprocessable_entity
      end
    end

    def edit; end

    def update
      if @tournament.update(tournament_params)
        redirect_to admin_tournament_path(@tournament), notice: 'Турнір оновлено'
      else
        render :edit, status: :unprocessable_entity
      end
    end

    def destroy
      @tournament.destroy
      redirect_to admin_tournaments_path, notice: 'Турнір видалено'
    end

    def activate
      @tournament.activate!
      redirect_to admin_tournament_path(@tournament), notice: 'Турнір активовано'
    rescue => e
      redirect_to admin_tournament_path(@tournament), alert: e.message
    end

    def complete
      @tournament.complete!
      redirect_to admin_tournament_path(@tournament), notice: 'Турнір завершено та бали перераховано'
    end

    private

    def set_tournament
      @tournament = Tournament.find_by(slug: params[:id]) || Tournament.find(params[:id])
    end

    def tournament_params
      params.require(:tournament).permit(
        :name, :description, :starts_at, :ends_at,
        :total_segments_count, :rated_segments_count
      )
    end
  end
end

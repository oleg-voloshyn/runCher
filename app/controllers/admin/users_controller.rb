module Admin
  class UsersController < BaseController
    before_action :require_admin!, only: [:update_role]
    before_action :set_user, only: [:show, :update_role]

    def index
      @users = User.order(created_at: :desc)
      @users = @users.where("first_name ILIKE ? OR last_name ILIKE ? OR email ILIKE ?",
                            "%#{params[:q]}%", "%#{params[:q]}%", "%#{params[:q]}%") if params[:q].present?
    end

    def show
      @participations = @user.tournament_participants.includes(:tournament).order(created_at: :desc)
    end

    def update_role
      if User::ROLES.include?(params[:role])
        @user.update!(role: params[:role])
        redirect_to admin_user_path(@user), notice: "Роль змінено на «#{params[:role]}»"
      else
        redirect_to admin_user_path(@user), alert: 'Невірна роль'
      end
    end

    private

    def set_user
      @user = User.find(params[:id])
    end

    def require_admin!
      redirect_to admin_dashboard_path, alert: 'Тільки адміністратор може змінювати ролі' unless current_user.admin?
    end
  end
end

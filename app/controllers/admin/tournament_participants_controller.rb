module Admin
  class TournamentParticipantsController < BaseController
    before_action :set_tournament

    def create
      user = User.find(params[:tournament_participant][:user_id])
      gender = params[:tournament_participant][:gender].presence || user.gender

      participant = @tournament.tournament_participants.find_or_initialize_by(user: user)
      if participant.new_record?
        participant.gender = gender
        participant.save!
        redirect_to admin_tournament_path(@tournament), notice: "#{user.full_name} додано до турніру"
      else
        redirect_to admin_tournament_path(@tournament), alert: "#{user.full_name} вже є учасником"
      end
    rescue ActiveRecord::RecordNotFound
      redirect_to admin_tournament_path(@tournament), alert: 'Користувача не знайдено'
    end

    def destroy
      participant = @tournament.tournament_participants.find(params[:id])
      name = participant.user.full_name
      participant.destroy
      redirect_to admin_tournament_path(@tournament), notice: "#{name} видалено з турніру"
    rescue ActiveRecord::RecordNotFound
      redirect_to admin_tournament_path(@tournament), alert: 'Учасника не знайдено'
    end

    private

    def set_tournament
      @tournament = Tournament.find(params[:tournament_id])
    end
  end
end

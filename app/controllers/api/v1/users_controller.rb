module Api
  module V1
    class UsersController < BaseController
      def me
        render json: user_json(current_user)
      end

      def update_gender
        if User::GENDERS.include?(params[:gender])
          current_user.update!(gender: params[:gender])
          render json: user_json(current_user)
        else
          render json: { error: 'Invalid gender' }, status: :unprocessable_entity
        end
      end

      private

      def user_json(user)
        {
          id:              user.id,
          first_name:      user.first_name,
          last_name:       user.last_name,
          full_name:       user.full_name,
          email:           user.email,
          profile_picture: user.profile_picture,
          gender:          user.gender,
          role:            user.role,
          strava_id:       user.strava_id
        }
      end
    end
  end
end

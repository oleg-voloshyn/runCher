require 'strava-ruby-client'

class SessionsController < ApplicationController
  def create
    # Exchange authorization code for an access token
    client = Strava::OAuth::Client.new(
      client_id: ENV['STRAVA_CLIENT_ID'],
      client_secret: ENV['STRAVA_CLIENT_SECRET']
    )

    response = client.oauth_token(
      code: params[:code]
    )

    access_token = response.access_token
    athlete = response.athlete

    # Find or create user based on Strava ID
    user = User.find_or_create_by(strava_id: athlete['id']) do |u|
      u.first_name = athlete['firstname']
      u.last_name = athlete['lastname']
      u.profile_picture = athlete['profile']
    end

    # Store user ID & access token in session
    session[:user_id] = user.id
    session[:access_token] = access_token

    redirect_to root_path, notice: "Logged in as #{user.first_name} #{user.last_name}"
  end

  def destroy
    session[:user_id] = nil
    session[:access_token] = nil
    redirect_to root_path, notice: "Logged out successfully"
  end  
end

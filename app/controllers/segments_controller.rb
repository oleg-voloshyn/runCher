class SegmentsController < ApplicationController
    before_action :authenticate_user!
  
    def index
      @segments = Segment.all.order(created_at: :desc)
    end
  
    def new
      @segment = Segment.new
    end
  
    def create
      if session[:token_expires_at].present? && Time.current >= session[:token_expires_at]
        refresh_token!
      end

      strava_id = params[:segment][:strava_id]
      access_token = session[:access_token]
  
      if strava_id.blank? || access_token.blank?
        redirect_to new_segment_path, alert: "Missing segment ID or access token"
        return
      end
  
      # Fetch from Strava API
      client = Strava::Api::Client.new(access_token: access_token)
  binding.pry
      begin
        segment_data = client.segment(strava_id)
  
        @segment = Segment.new(
          strava_id: segment_data['id'],
          name: segment_data['name'],
          distance: segment_data['distance'],
          average_grade: segment_data['average_grade'],
          maximum_grade: segment_data['maximum_grade'],
          elevation_high: segment_data['elevation_high'],
          elevation_low: segment_data['elevation_low'],
          start_latitude: segment_data['start_latlng'][0],
          start_longitude: segment_data['start_latlng'][1],
          end_latitude: segment_data['end_latlng'][0],
          end_longitude: segment_data['end_latlng'][1]
        )
  
        if @segment.save
          redirect_to segments_path, notice: "Segment added successfully!"
        else
          render :new, status: :unprocessable_entity
        end
      rescue Strava::Errors::Fault => e
        redirect_to new_segment_path, alert: "Strava API error: #{e.message}"
      end
    end

    def refresh_token!
        client = Strava::OAuth::Client.new(
        client_id: ENV['STRAVA_CLIENT_ID'],
        client_secret: ENV['STRAVA_CLIENT_SECRET']
      )
    
      response = client.oauth_token(
        grant_type: 'refresh_token',
        refresh_token: session[:refresh_token]
      )
    
      session[:access_token] = response.access_token
      session[:refresh_token] = response.refresh_token
      session[:token_expires_at] = Time.at(response.expires_at)
    end
  end
  
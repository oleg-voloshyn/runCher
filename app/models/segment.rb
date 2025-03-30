require 'strava-ruby-client'

class Segment < ApplicationRecord
  validates :strava_id, presence: true, uniqueness: true

  # Fetch segment details from Strava API and store them
  def self.fetch_and_store_segment(segment_id, access_token)
    client = Strava::Api::Client.new(access_token: access_token)
    
    begin
      segment_data = client.segment(segment_id)
      
      create!(
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
    rescue StandardError => e
      Rails.logger.error "Failed to fetch segment: #{e.message}"
      nil
    end
  end
end

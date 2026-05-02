require 'strava-ruby-client'

class Segment < ApplicationRecord
  has_many :tournament_segments, dependent: :destroy
  has_many :tournaments, through: :tournament_segments
  has_many :segment_efforts, dependent: :destroy
  has_many :tournament_scores, dependent: :destroy

  validates :strava_id, presence: true, uniqueness: true
  validates :name, presence: true

  def self.fetch_and_store_segment(segment_id, access_token)
    client = Strava::Api::Client.new(access_token: access_token)

    segment_data = client.segment(segment_id)

    find_or_initialize_by(strava_id: segment_data.id.to_s).tap do |seg|
      seg.assign_attributes(
        name:            segment_data.name,
        distance:        segment_data.distance,
        average_grade:   segment_data.average_grade,
        maximum_grade:   segment_data.maximum_grade,
        elevation_high:  segment_data.elevation_high,
        elevation_low:   segment_data.elevation_low,
        start_latitude:  segment_data.start_latlng&.lat,
        start_longitude: segment_data.start_latlng&.lng,
        end_latitude:    segment_data.end_latlng&.lat,
        end_longitude:   segment_data.end_latlng&.lng,
        polyline:        segment_data.map&.polyline
      )
      seg.save!
    end
  rescue StandardError => e
    Rails.logger.error "Failed to fetch segment #{segment_id}: #{e.message}"
    nil
  end
end

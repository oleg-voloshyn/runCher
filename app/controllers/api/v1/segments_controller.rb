module Api
  module V1
    class SegmentsController < BaseController
      def index
        segments = Segment.all.order(:name)
        render json: segments.map { |s| segment_json(s) }
      end

      def show
        segment = Segment.find(params[:id])
        render json: segment_json(segment)
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Segment not found' }, status: :not_found
      end

      private

      def segment_json(s)
        {
          id:              s.id,
          strava_id:       s.strava_id,
          name:            s.name,
          distance:        s.distance,
          average_grade:   s.average_grade,
          maximum_grade:   s.maximum_grade,
          elevation_high:  s.elevation_high,
          elevation_low:   s.elevation_low,
          start_latitude:  s.start_latitude,
          start_longitude: s.start_longitude,
          end_latitude:    s.end_latitude,
          end_longitude:   s.end_longitude
        }
      end
    end
  end
end

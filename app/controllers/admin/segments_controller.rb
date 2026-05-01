module Admin
  class SegmentsController < BaseController
    before_action :set_segment, only: [:show, :destroy]

    def index
      @segments = Segment.order(:name)
      @segments = @segments.where("name ILIKE ?", "%#{params[:q]}%") if params[:q].present?
    end

    def show; end

    def new
      @segment = Segment.new
    end

    def create
      raw = params[:segment][:strava_id].to_s.strip
      # Accept full URL (strava.com/segments/12345) or bare ID
      strava_id = raw[/\d+$/] || raw

      if strava_id.blank?
        return redirect_to new_admin_segment_path, alert: 'Введіть Strava ID сегменту'
      end

      if Segment.exists?(strava_id: strava_id)
        return redirect_to admin_segments_path, notice: 'Сегмент вже є в базі'
      end

      begin
        current_user.ensure_fresh_token!
      rescue => e
        return redirect_to new_admin_segment_path, alert: "#{e.message}"
      end

      segment = Segment.fetch_and_store_segment(strava_id, current_user.access_token)

      if segment
        redirect_to admin_segments_path, notice: "Сегмент «#{segment.name}» додано"
      else
        redirect_to new_admin_segment_path, alert: 'Не вдалося отримати сегмент зі Strava. Перевірте ID.'
      end
    end

    def destroy
      @segment.destroy
      redirect_to admin_segments_path, notice: 'Сегмент видалено'
    end

    private

    def set_segment
      @segment = Segment.find(params[:id])
    end
  end
end

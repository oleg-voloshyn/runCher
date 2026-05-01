module Admin
  class DashboardController < BaseController
    def index
      @stats = {
        tournaments: Tournament.count,
        active_tournaments: Tournament.active.count,
        segments: Segment.count,
        users: User.count,
        activities: Activity.count
      }

      @recent_tournaments = Tournament.order(created_at: :desc).limit(5)
      @recent_users       = User.order(created_at: :desc).limit(5)
    end
  end
end

namespace :segments do
  desc "Backfill polylines for segments that were added before the polyline column existed"
  task backfill_polylines: :environment do
    admin = User.where(role: %w[admin moderator]).first
    abort "No admin/moderator user found — cannot refresh Strava token" unless admin

    begin
      admin.ensure_fresh_token!
    rescue => e
      abort "Could not refresh token for #{admin.email}: #{e.message}"
    end

    segments = Segment.where(polyline: nil)
    puts "Backfilling polylines for #{segments.count} segment(s)..."

    segments.each do |seg|
      updated = Segment.fetch_and_store_segment(seg.strava_id, admin.access_token)
      if updated&.polyline.present?
        puts "  ✓ #{updated.name}"
      else
        puts "  ✗ #{seg.name} (no polyline returned)"
      end
      sleep 0.4
    rescue => e
      puts "  ✗ #{seg.name}: #{e.message}"
    end

    puts "Done."
  end
end

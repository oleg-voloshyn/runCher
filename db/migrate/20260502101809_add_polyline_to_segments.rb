class AddPolylineToSegments < ActiveRecord::Migration[8.1]
  def change
    add_column :segments, :polyline, :text
  end
end

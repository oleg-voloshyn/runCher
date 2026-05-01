class CreateActivities < ActiveRecord::Migration[8.1]
  def change
    create_table :activities do |t|
      t.references :user,             null: false, foreign_key: true
      t.string  :strava_activity_id,  null: false
      t.string  :name
      t.string  :activity_type
      t.datetime :start_date
      t.integer :elapsed_time         # seconds
      t.float   :distance             # meters
      t.boolean :processed,           null: false, default: false

      t.timestamps
    end

    add_index :activities, :strava_activity_id, unique: true
    add_index :activities, [:user_id, :start_date]
  end
end

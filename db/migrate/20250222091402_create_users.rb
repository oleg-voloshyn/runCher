class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :strava_id
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :profile_picture

      t.timestamps
    end
  end
end

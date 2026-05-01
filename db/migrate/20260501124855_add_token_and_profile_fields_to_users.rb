class AddTokenAndProfileFieldsToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :gender, :string, default: 'male'
    add_column :users, :role, :string, default: 'user'
    add_column :users, :access_token, :string
    add_column :users, :refresh_token, :string
    add_column :users, :token_expires_at, :datetime
    add_index :users, :strava_id, unique: true
  end
end

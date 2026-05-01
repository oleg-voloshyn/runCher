class AddMobileTokenToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :mobile_token, :string
    add_index :users, :mobile_token, unique: true
  end
end

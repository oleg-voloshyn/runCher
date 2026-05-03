class AddSlugToTournaments < ActiveRecord::Migration[8.1]
  def change
    add_column :tournaments, :slug, :string
    add_index :tournaments, :slug, unique: true

    # Backfill slugs for existing tournaments
    reversible do |dir|
      dir.up { execute "UPDATE tournaments SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL" }
    end

    change_column_null :tournaments, :slug, false
  end
end

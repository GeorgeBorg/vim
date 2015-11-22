class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.integer :user_id
      t.datetime :when
      t.string :what
      t.string :where
      t.string :description
      t.boolean :private

      t.timestamps null: false
    end
  end
end

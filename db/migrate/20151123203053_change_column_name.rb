class ChangeColumnName < ActiveRecord::Migration
  def change
  	rename_column :events, :user_id, :creator_id
  end
end

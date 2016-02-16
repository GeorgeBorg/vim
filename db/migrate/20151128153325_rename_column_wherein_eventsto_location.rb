class RenameColumnWhereinEventstoLocation < ActiveRecord::Migration
  def change
  	rename_column :events, :where, :location
  end
end

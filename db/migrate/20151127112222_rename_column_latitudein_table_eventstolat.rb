class RenameColumnLatitudeinTableEventstolat < ActiveRecord::Migration
  def change
  	rename_column :events, :latitude, :lat
  	rename_column :events, :longitude, :lng
  end
end

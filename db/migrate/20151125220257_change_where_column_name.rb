class ChangeWhereColumnName < ActiveRecord::Migration
  def change
  	rename_column :events, :when, :time
  end
end

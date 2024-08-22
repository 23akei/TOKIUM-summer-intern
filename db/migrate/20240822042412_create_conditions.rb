class CreateConditions < ActiveRecord::Migration[7.0]
  def change
    create_table :conditions do |t|
      t.string :key
      t.string :value
      t.string :condition
      t.integer :flow_id
      t.integer :step

      t.timestamps
    end
    add_foreign_key :conditions, :flows, column: :flow_id
  end
end

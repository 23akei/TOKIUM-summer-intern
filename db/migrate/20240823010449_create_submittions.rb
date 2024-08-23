class CreateSubmittions < ActiveRecord::Migration[7.0]
  def change
    create_table :submittions do |t|
      t.string :status
      t.integer :step
      t.integer :user_id
      t.integer :shinsei_id

      t.timestamps
    end
  end
end

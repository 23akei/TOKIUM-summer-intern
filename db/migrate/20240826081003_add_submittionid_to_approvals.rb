class AddSubmittionidToApprovals < ActiveRecord::Migration[7.0]
  def change
    add_column :approvals, :submittion_id, :integer
  end
end

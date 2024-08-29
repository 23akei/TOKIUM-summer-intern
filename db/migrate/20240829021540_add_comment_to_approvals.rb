class AddCommentToApprovals < ActiveRecord::Migration[7.0]
  def change
    add_column :approvals, :comment, :string
  end
end

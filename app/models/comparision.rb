class Comparision < ApplicationRecord
  OPERATORS = {
    eq: 'eq',
    neq: 'neq',
    gt: 'gt',
    lt: 'lt',
    ge: 'ge',
    le: 'le',
  }.freeze
end

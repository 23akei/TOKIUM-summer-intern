Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:create]
      get 'users/role/:role', to: 'users#index'
      get 'users/:id', to: 'users#show'
    end
  end
end

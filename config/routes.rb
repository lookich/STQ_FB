require 'sidekiq/web'
require 'sidekiq-scheduler/web'

Rails.application.routes.draw do
  mount Sidekiq::Web => '/sidekiq'
  root to: "rate#index"
  get "/", to: "rate#index"
  resources :admin, only: [:index, :create, :update]
  resources :rate, only: [:index]
  match '*path', to: 'rate#index', via: :all
end

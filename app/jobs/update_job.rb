require 'time_difference'

class UpdateJob
  include Sidekiq::Worker
  include RateHelper

  def perform
    @rates = Rate.all
    Rate.destroy_all
    get_json
    @new_rates = @rates.map { |rate_name, rate| { rate_name: rate_name, rate: rate } }
    Rate.create!(@new_rates)
    admin_change_rate
  end
end

include RateHelper

class RateController < ApplicationController
  include RateHelper
  def index
    @rates = Rate.all.order('rate_name')
    if @rates.empty?
      @rates = Rate.new
      get_json
      @new_rates = @rates.map { |rate_name, rate| { rate_name: rate_name, rate: rate } }
      Rate.create!(@new_rates)
      @rates = Rate.all.order('rate_name')
    end

    hash = @rates.map{ |c| [c.rate_name,c.rate] }.to_h

    respond_to do |format|
        format.html
        format.json { render json: { rates: hash.to_a } }
    end

  end

  private

  def new_rate_params
      params.require(:rate).permit(:rate, :rate_name, :id)
  end
end

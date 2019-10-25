require 'time_difference'
module RateHelper
  def help
    :available
  end
  
  def get_json
    # response = RestClient.get "https://api.exchangerate-api.com/v4/latest/USD"
    response = File.read(Rails.root.join('public/json.json'))
    response_obj = JSON.parse(response)
    if response_obj.present?
      @rate = response_obj['rates']
      @base_rate = response_obj['base']
      @rates = []
      @rate.each_slice(1) do |value|
        @rates << value[0]
      end
    end
  end

  def admin_change_rate
    admin_data = Admin.all.order('created_at DESC')
    date_time_now = DateTime.now.to_datetime
    admin_data.map do |i|
      i.datetime = i.datetime.to_datetime
      if i.datetime? and i.datetime >= date_time_now
        @rates = Rate.all.order('rate_name')
        @rates.map do |e|
          if i.rate_name == e.rate_name
            @scheduler_time = TimeDifference.between(date_time_now, i.datetime.to_datetime).in_seconds
            index = @rates.find_index(e)
            e.rate = i.rate
            e.save
          end
        end
        UpdateJob.perform_at(@scheduler_time.seconds.from_now)
        # redirect_to admin_url(i.id)
      # else
      #   redirect_to admin_index_url(@rates)
      end
    end
  end
end

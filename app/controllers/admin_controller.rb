class AdminController < ApplicationController
  include RateHelper
  def index
    @data = Admin.last(20).sort_by(&:'created_at').reverse
    @is_done = false

    respond_to do |format|
      format.html
      format.json { render json: {data: @data, is_done: @is_done} }
    end
  end

  def create
    @data = Admin.new(data_params)
    respond_to do |format|
      if @data.valid?
        @serch_rate = Admin.find_by_rate_name(params[:rate_name])
        if @serch_rate.present?
          @serch_rate.destroy
        end
        @data.save
        if params.has_key?(:admin)
          admin_change_rate
        end
        format.html { redirect_to admin_index_url }
        format.json { render json: admin_index_url }
      end
    end
  end

  def update
    @rate = Rate.find_by(rate_name: params[:rate_name])
    new_params = params[:rate]
    datetime = DateTime.now.strftime("%F %T")
    prate_id = @rate.id
    @rates = execute_statement( "UPDATE rates SET rate = #{new_params}, updated_at = current_timestamp WHERE id = #{rate_id}" )
    @data = Admin.find_by(rate_name: params[:rate_name])
    respond_to do |format|
      format.html { render action: 'index'  }
      format.json { render json: admin_index_url }
    end
  end

  def execute_statement(sql)
    results = ActiveRecord::Base.connection.execute(sql)

    if results.present?
      return results
    else
      return nil
    end
  end

  private

  def data_params
    params.require(:admin).permit(:rate, :datetime, :rate_name)
  end
end

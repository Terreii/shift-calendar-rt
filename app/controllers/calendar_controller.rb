class CalendarController < ApplicationController
  # GET /calendar or /calendar.json
  def index
  end

  # GET /calendar/1 or /calendar/1/2022/4
  def show
    month = params.has_key?(:month) ? params[:month].to_i : Date.today.month
    @shift = Shifts::Base.create params[:id], year: year_param, month: month
    if @shift.nil?
      not_found
    end
    month_date = Date.new(year_param, month, 1)
    @previous_month = month_date.prev_month
    @next_month = month_date.next_month
  end

  # GET /calendar/1/2023
  def year
    @year = year_param
    not_found if Shifts::Base.create(params[:id], year: @year, month: 1).nil?

    @months = []
    12.times do |index|
      shift = Shifts::Base.create params[:id], year: @year, month: index + 1
      @months << shift
    end
  end

  private

    def year_param
      return params[:year].to_i if params.has_key? :year
      Date.today.year
    end
end

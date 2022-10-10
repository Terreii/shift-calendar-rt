class CalendarController < ApplicationController
  # GET /calendar or /calendar.json
  def index
  end

  # GET /calendar/1 or /calendar/1/2022/4
  def show
    year = year_param
    month = params.has_key?(:month) ? params[:month].to_i : Date.today.month
    @shift = Shifts::Base.create params[:id], year: year, month: month
    if @shift.nil?
      not_found
    end
    month_date = Date.new(year, month, 1)
    @previous_month = month_date.prev_month
    @next_month = month_date.next_month

    today = Date.today
    last_month = 1.month.ago
    if today.year == year && today.month == month || last_month.year == year && last_month.month == month
      @current_shift, @current_shift_date = @shift.current_working_shift
    end
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

    if Date.today.year == @year
      @current_shift, @current_shift_date = @months[0].current_working_shift
    end
  end

  private

    def year_param
      return params[:year].to_i if params.has_key? :year
      Date.today.year
    end
end

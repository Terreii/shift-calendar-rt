class CalendarController < ApplicationController
  # GET /calendar or /calendar.json
  def index
  end

  # GET /calendar/1 or /calendar/1/2022/4
  def show
    month = params.has_key?(:month) ? params[:month].to_i : Date.today.month
    @shift = Shifts::Bosch66.new year: year_param, month: month
  end

  # GET /calendar/1/2023
  def year
  end

  private

    def year_param
      params[:year].to_i if params.has_key? :year
      Date.today.year
    end
end

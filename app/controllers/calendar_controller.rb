class CalendarController < ApplicationController
  # GET /calendar or /calendar.json
  def index
  end

  # GET /calendar/1 or /calendar/1/2022/4
  def show
    if params.has_key?(:month)
      puts "Month"
    else
      puts "current Month"
    end
  end

  # GET /calendar/1/2023
  def year
    puts "Year"
  end
end

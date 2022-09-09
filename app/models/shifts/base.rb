class Shifts::Base
  include Enumerable

  attr_reader :year, :month

  def initialize(year:, month:)
    @year = year.to_i
    @month = month.to_i
  end

  def at(day)
    []
  end

  def each
    numbers_of_days = Time.days_in_month @month, @year
    numbers_of_days.times do |index|
      yield at(index + 1)
    end
    self
  end

  def each_with_date
    each_with_index do |data, index|
      yield data, Date.new(@year, @month, index + 1)
    end
  end

  def groups
    0
  end
end

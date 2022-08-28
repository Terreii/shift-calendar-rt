class Shifts::Bosch66
  include Enumerable

  attr_reader :year, :month

  @@start_date = Date.new(2010, 4, 4)
  @@group_offsets = {
    1 => 8,
    2 => 2,
    3 => 6,
    4 => 0,
    5 => 4,
    6 => 10
  }
  @@shifts = {
    0 => :morning,
    1 => :evening,
    2 => :night,
    3 => :free,
    4 => :free,
    5 => :free
  }
  @@groups = 6
  @@shift_cycle_length = 12

  def initialize(year:, month:)
    @year = year.to_i
    @month = month.to_i
  end

  def at(day)
    days = days_in_cycle(day)
    Array.new @@groups do |index|
      days_offsetted = days + group_offset(index + 1)
      days_offsetted -= @@shift_cycle_length if days_offsetted >= @@shift_cycle_length
      # days are devided by 2 because there are always 2 days of same shifts
      @@shifts[days_offsetted / 2]
    end
  end

  def each
    numbers_of_days = Time.days_in_month @month, @year
    numbers_of_days.times do |day_in_month|
      yield at(day_in_month + 1)
    end
    self
  end

  private

  def days_in_cycle(day)
    days_since_start = Date.new(@year, @month, day.to_i) - @@start_date
    days_since_start.to_i % @@shift_cycle_length
  end

  def group_offset(group)
    @@group_offsets[group] if @@group_offsets.has_key? group
  end
end

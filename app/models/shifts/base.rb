class Shifts::Base
  include Enumerable

  def self.create(key, options)
    case key
    when "bosch-6-6", :bosch66
      Shifts::Bosch66
    when "bosch-6-4", :bosch64
      Shifts::Bosch64
    else
      return nil
    end.new(**options)
  end

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

  def work_days_count
    word_days = Array.new(groups, 0)
    each do |data|
      data.each_with_index do |shift, index|
        word_days[index] += 1 unless shift == :free
      end
    end
    word_days
  end
end

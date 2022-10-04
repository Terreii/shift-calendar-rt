class Shifts::Bosch64Test < ActiveSupport::TestCase
  test "returns the shifts of every group for a day" do
    month = Shifts::Bosch64.new year: 2022, month: 8
    assert_equal [:free, :morning, :evening, :night, :free], month.at(22)
    assert_equal [:evening, :morning, :night, :free, :free], month.at(23)

    month2 = Shifts::Bosch64.new year: 2023, month: 12
    assert_equal [:night, :evening, :free, :free, :morning], month2.at(8)
  end

  test "it iterates through all days in a month" do
    month = Shifts::Bosch64.new year: 2022, month: 9
    month.each_with_index do |day, index|
      assert_equal month.at(index + 1), day
    end
  end

  test "should return self from each" do
    month = Shifts::Bosch64.new year: 2022, month: 9
    result = month.each { |day| }
    assert_equal month, result
  end

  test "should have an each_with_date method" do
    month = Shifts::Bosch64.new year: 2022, month: 9
    month.each_with_date do |day, date|
      assert_equal month.at(date.day), day
      assert_instance_of Date, date
    end
  end

  test "should have a work_days_count method" do
    month = Shifts::Bosch64.new year: 2022, month: 10
    assert_equal [18, 19, 19, 19, 18], month.work_days_count
  end
end

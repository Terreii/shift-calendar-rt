class Shifts::Bosch66Test < ActiveSupport::TestCase
  test "returns the shifts of every group for a day" do
    month = Shifts::Bosch66.new year: 2022, month: 8
    assert_equal [:free, :morning, :night, :free, :evening, :free], month.at(22)
    assert_equal [:free, :evening, :free, :morning, :night, :free], month.at(23)

    month2 = Shifts::Bosch66.new year: 2023, month: 12
    assert_equal [:morning, :free, :free, :night, :free, :evening], month2.at(8)
  end
end

class CalendarHelperTest < ActionView::TestCase
  test "current_month? should check if it is the current month" do
    today = Date.today
    assert current_month?(today.year, today.month), "true if current month"

    other = Date.new(2022, 8, 3)
    assert_not current_month?(other.year, other.month), "false if other month"
  end
end

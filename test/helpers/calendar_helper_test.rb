class CalendarHelperTest < ActionView::TestCase
  test "current_month? should check if it is the current month" do
    today = Date.today
    assert current_month?(today.year, today.month), "true if current month"

    other = Date.new(2022, 8, 3)
    assert_not current_month?(other.year, other.month), "false if other month"
  end

  test "week_cell_length should return the rowspan to next week" do
    date = Date.new 2022, 9, 5
    assert_equal 7, week_cell_length(date)
  end

  test "week_cell_length should return a lower rowspan at the start of month" do
    date = Date.new 2022, 9, 1
    assert_equal 4, week_cell_length(date)

    date = Date.new 2022, 5, 1
    assert_equal 1, week_cell_length(date), "at a sunday"
  end

  test "week_cell_length should be capped by end of month" do
    date = Date.new 2022, 6, 27
    assert_equal 4, week_cell_length(date), "not full week"

    date = Date.new 2022, 6, 30
    assert_equal 1, week_cell_length(date), "at last day"
  end
end

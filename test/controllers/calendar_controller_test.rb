require "test_helper"

class CalendarControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get calendar_index_url
    assert_response :success
  end

  test "should get show" do
    get calendar_path(id: "bosch-6-6")
    assert_response :success
  end

  test "should get year" do
    get year_calendar_path(id: "bosch-6-6", year: 2022)
    assert_response :success
  end

  test "should get month" do
    get month_calendar_path(id: "bosch-6-6", year: 2023, month: 2)
    assert_response :success
  end

  test "should select shift model" do
    get month_calendar_path(id: "bosch-6-6", year: 2022, month: 6)
    assert_response :success
  end

  test "should error if shift model doesn't exist" do
    assert_raises(ActionController::RoutingError) do 
      get month_calendar_path(id: "some-other", year: 2022, month: 6)
    end
  end
end

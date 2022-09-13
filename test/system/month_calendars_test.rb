require "application_system_test_case"

class MonthCalendarsTest < ApplicationSystemTestCase
   test "visiting a month calendar url" do
     visit month_calendar_path(id: "bosch-6-6", year: 2022, month: 8)
  
     assert_selector "#month_2022-8 caption", text: "August - 2022"
     assert_selector "#day_2022-08-13 > :first-child", text: "13"
     assert_selector "#day_2022-08-13 > :nth-child(2)", text: "Saturday\nSat"
     # Groups
     ['', 'N', '', 'E', '', 'M'].each_with_index do |text, index|
       assert_selector "#day_2022-08-13 > :nth-child(#{index + 3})", text:
     end
   end

   test "visiting the calendar url shows the current month" do
     visit calendar_url(id: "bosch-6-6")
     today = Date.today

     table = find("#month_#{today.year}-#{today.month}").native.attribute('outerHTML')
     assert_not_empty table

     visit month_calendar_path(id: "bosch-6-6", year: today.year, month: today.month)
     assert_equal find("#month_#{today.year}-#{today.month}").native.attribute('outerHTML'), table
   end

   test "visiting a month calendar url shows the selected shift" do
     visit month_calendar_path(id: "bosch-6-4", year: 2022, month: 8)
     today = Date.today

     ['E', 'M', 'N', '', ''].each_with_index do |text, index|
       assert_selector "#day_2022-08-13 > :nth-child(#{index + 3})", text:
     end
   end
end

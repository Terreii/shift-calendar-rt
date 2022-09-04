module CalendarHelper
  def current_month?(year, month)
    today = Date.today
    year == today.year && month == today.month
  end

  def day_row(date, data)
    tag.tr
  end
end

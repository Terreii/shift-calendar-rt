module CalendarHelper
  def current_month?(year, month)
    today = Date.today
    year == today.year && month == today.month
  end

  def screen_reader_long_text(short, long)
    screen_reader = tag.span long, class: "visually-hidden"
    visually_only = tag.span short, aria: { hidden: true }
    screen_reader + visually_only
  end

  def week_cell_length(date)
    return 1 if date.sunday?
    days_to_month_end = Time.days_in_month(date.month, date.year) - date.day
    1 + [7 - date.wday, days_to_month_end].min
  end

  def daylight_saving_text(date)
    return t(:forward, scope: "calendar.dls") if date.month == 3
    return t(:back, scope: "calendar.dls") if date.month == 10
    nil
  end
end

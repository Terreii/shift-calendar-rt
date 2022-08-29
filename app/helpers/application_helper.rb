module ApplicationHelper
  # Renders a navbar-link.
  # It sets the classes if the link is the current path.
  def nav_link_to(text, path, options, &block)
    is_current_path = request.path == path
    options[:class] = class_names(options[:class], options["class"], { "current": is_current_path })
    options.delete "class" if options.has_key? "class"
    options["aria-current"] = is_current_path ? "page" : nil
    link_to text, path, options, &block
  end
end

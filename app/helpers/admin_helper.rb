module AdminHelper
  def admin_nav_link(label, path, icon: nil)
    active = current_page?(path) || request.path.start_with?(path.sub(/\/$/, ''))
    base   = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
    cls    = active ? "#{base} bg-orange-500 text-white" : "#{base} text-slate-400 hover:bg-slate-800 hover:text-white"

    link_to path, class: cls do
      concat(content_tag(:span, icon, class: "text-base")) if icon
      concat(content_tag(:span, label))
    end
  end

  def status_badge(status)
    colors = {
      'draft'     => 'bg-gray-100 text-gray-600',
      'active'    => 'bg-green-100 text-green-700',
      'completed' => 'bg-blue-100 text-blue-700'
    }
    labels = { 'draft' => 'Чернетка', 'active' => 'Активний', 'completed' => 'Завершено' }
    cls = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold #{colors[status] || 'bg-gray-100 text-gray-600'}"
    content_tag(:span, labels[status] || status, class: cls)
  end

  def role_badge(role)
    colors = { 'admin' => 'bg-red-100 text-red-700', 'moderator' => 'bg-purple-100 text-purple-700', 'user' => 'bg-gray-100 text-gray-600' }
    cls = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold #{colors[role] || 'bg-gray-100 text-gray-600'}"
    content_tag(:span, role, class: cls)
  end

  def gender_label(gender)
    gender == 'female' ? 'Жінки' : 'Чоловіки'
  end
end

-- Keep html-only blocks out of DOCX and docx-only blocks out of HTML;
-- swap .svg figure sources for .png in DOCX output.
function Div(el)
  if FORMAT:match("docx") then
    if el.classes:includes("html-only") then return {} end
    if el.classes:includes("docx-only") then return el.content end
  else
    if el.classes:includes("docx-only") then return {} end
  end
  return el
end

function Span(el)
  if el.classes:includes("ev") and FORMAT:match("docx") then
    -- render evidence badges as bracketed bold labels in Word
    return { pandoc.Strong({ pandoc.Str("[" .. pandoc.utils.stringify(el.content) .. "]") }) }
  end
  return el
end

function Image(el)
  if FORMAT:match("docx") then
    el.src = el.src:gsub("%.svg$", ".png")
  end
  return el
end

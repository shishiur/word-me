-- HTML/DOCX differences for the study book.
local box_styles = { concept="Concept Box", method="Method Box", caution="Caution Box", ecology="Ecology Box",
  recap="Recap Box", check="Check Box", ["fig-read"]="Figure Reading", quote="Quote Box" }

local TOC_XML = [[<w:p><w:pPr><w:pStyle w:val="TOCHeading"/></w:pPr><w:r><w:t>সূচিপত্র</w:t></w:r></w:p><w:p><w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \o "1-1" \h \z \u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>সূচিপত্র হালনাগাদ করতে এখানে ক্লিক করে F9 চাপুন (Word)।</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>]]

function Div(el)
  local docx = FORMAT:match("docx")
  if docx then
    if el.classes:includes("html-only") then return {} end
    if el.classes:includes("docx-only") then return el.content end
    if el.identifier == "toc-here" then return pandoc.RawBlock("openxml", TOC_XML) end
    if el.classes:includes("divider") then return el.content end
    for cls, style in pairs(box_styles) do
      if el.classes:includes(cls) then el.attributes["custom-style"] = style; return el end
    end
  else
    if el.classes:includes("docx-only") then return {} end
  end
  return el
end

function RawBlock(el)
  if FORMAT:match("docx") and el.format == "html" then
    local t = el.text
    if t:match("<img") then return {} end
    -- <h1>..</h1> inside divider raw html becomes a real heading in Word
    local h = t:match("<h1>(.-)</h1>")
    if h then return pandoc.Header(1, pandoc.Str(h)) end
  end
  return el
end

function Span(el)
  if FORMAT:match("docx") then
    if el.classes:includes("ev") then
      return { pandoc.Strong({ pandoc.Str("[" .. pandoc.utils.stringify(el.content) .. "]") }) }
    end
    if el.classes:includes("label") then
      return { pandoc.Strong(el.content), pandoc.LineBreak() }
    end
  end
  return el
end

function Image(el)
  if FORMAT:match("docx") then el.src = el.src:gsub("%.svg$", ".png") end
  return el
end

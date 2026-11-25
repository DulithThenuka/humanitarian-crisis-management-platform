const fs = require('fs');
const path = require('path');

const mdContent = fs.readFileSync(path.join(__dirname, 'FINAL_REPORT.md'), 'utf8');

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const output = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBuffer = [];
  let inTable = false;
  let tableHeaderParsed = false;
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle code block
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        if (codeBlockLang === 'mermaid') {
          output.push(`<div class="mermaid-diagram"><pre class="mermaid">${escapeHtml(codeBuffer.join('\n'))}</pre></div>`);
        } else {
          output.push(`<pre class="code-box"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
        }
        inCodeBlock = false;
        codeBlockLang = '';
        codeBuffer = [];
      } else {
        inCodeBlock = true;
        codeBlockLang = line.trim().replace(/^```/, '').trim();
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Page break
    if (line.trim() === '\\newpage') {
      if (inList) { output.push('</ul>'); inList = false; }
      if (inTable) { output.push('</tbody></table>'); inTable = false; }
      output.push('<div class="page-break"></div>');
      continue;
    }

    // Horizontal rule
    if (line.trim() === '---') {
      if (inList) { output.push('</ul>'); inList = false; }
      if (inTable) { output.push('</tbody></table>'); inTable = false; }
      output.push('<hr class="divider" />');
      continue;
    }

    // Table handling
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (cells.every(c => c.match(/^:?-+:?$/))) {
        // Separator row
        continue;
      }
      if (!inTable) {
        if (inList) { output.push('</ul>'); inList = false; }
        inTable = true;
        tableHeaderParsed = true;
        output.push('<table class="report-table"><thead><tr>');
        cells.forEach(c => output.push(`<th>${inlineFormat(c)}</th>`));
        output.push('</tr></thead><tbody>');
      } else {
        output.push('<tr>');
        cells.forEach(c => output.push(`<td>${inlineFormat(c)}</td>`));
        output.push('</tr>');
      }
      continue;
    } else if (inTable) {
      output.push('</tbody></table>');
      inTable = false;
    }

    // Unordered list
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const content = line.trim().substring(2);
      if (!inList) {
        inList = true;
        output.push('<ul class="report-list">');
      }
      output.push(`<li>${inlineFormat(content)}</li>`);
      continue;
    } else if (inList && line.trim() === '') {
      output.push('</ul>');
      inList = false;
    }

    // Headers
    if (line.startsWith('### ')) {
      if (inList) { output.push('</ul>'); inList = false; }
      output.push(`<h3>${inlineFormat(line.substring(4))}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { output.push('</ul>'); inList = false; }
      output.push(`<h2>${inlineFormat(line.substring(3))}</h2>`);
      continue;
    }
    if (line.startsWith('# ')) {
      if (inList) { output.push('</ul>'); inList = false; }
      output.push(`<h1>${inlineFormat(line.substring(2))}</h1>`);
      continue;
    }

    if (line.trim() === '') {
      continue;
    }

    // Regular paragraph
    output.push(`<p>${inlineFormat(line)}</p>`);
  }

  if (inList) output.push('</ul>');
  if (inTable) output.push('</tbody></table>');

  return output.join('\n');
}

function inlineFormat(text) {
  let res = text;
  // Bold + Italics
  res = res.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  // Bold
  res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italics
  res = res.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Code
  res = res.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Links
  res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return res;
}

const bodyHtml = renderMarkdown(mdContent);

const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Group 7 - Final Project Report</title>
  <style>
    @page {
      size: A4;
      margin: 22mm 20mm 22mm 25mm;
      @bottom-right {
        content: counter(page);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 9pt;
        color: #555;
      }
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.15;
      color: #1a1a1a;
      background-color: #ffffff;
      margin: 0;
      padding: 20px 40px;
    }
    h1, h2, h3, h4 {
      color: #14291e;
      font-weight: 700;
      margin-top: 1.2em;
      margin-bottom: 0.4em;
      page-break-after: avoid;
      break-after: avoid;
    }
    h1 {
      font-size: 18pt;
      border-bottom: 2px solid #2e5b3e;
      padding-bottom: 4px;
    }
    h2 {
      font-size: 14pt;
      border-bottom: 1px solid #dbe4c6;
      padding-bottom: 3px;
    }
    h3 {
      font-size: 12pt;
    }
    p {
      margin-top: 0.3em;
      margin-bottom: 0.6em;
      text-align: justify;
      text-justify: inter-word;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
      margin-top: 2em;
    }
    hr.divider {
      border: 0;
      border-top: 1px solid #ccc;
      margin: 1.5em 0;
    }
    table.report-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    table.report-table th, table.report-table td {
      border: 1px solid #c2ceb8;
      padding: 6px 10px;
      text-align: left;
    }
    table.report-table th {
      background-color: #14291e;
      color: #ffffff;
      font-weight: 600;
    }
    table.report-table tr:nth-child(even) {
      background-color: #f7f9f5;
    }
    ul.report-list {
      margin: 0.4em 0 0.8em 1.5em;
      padding-left: 10px;
    }
    ul.report-list li {
      margin-bottom: 0.25em;
    }
    pre.code-box {
      background-color: #f4f6f2;
      border: 1px solid #d0d9c5;
      border-left: 4px solid #2e5b3e;
      padding: 10px 14px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 9pt;
      line-height: 1.25;
      overflow-x: auto;
      page-break-inside: avoid;
      white-space: pre-wrap;
    }
    code {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 9.5pt;
      background-color: #eef2ea;
      padding: 2px 4px;
      border-radius: 3px;
      color: #14291e;
    }
    .mermaid-diagram {
      background-color: #fafbf9;
      border: 1px solid #dbe4c6;
      border-radius: 4px;
      padding: 12px;
      margin: 1em 0;
      page-break-inside: avoid;
    }
    .mermaid {
      font-family: 'Consolas', monospace;
      font-size: 9pt;
      white-space: pre-wrap;
    }
    .cover-box {
      text-align: center;
      padding: 40px 10px;
    }
    .cover-title {
      font-size: 24pt;
      color: #14291e;
      font-weight: 800;
      margin: 20px 0 10px 0;
    }
    .cover-subtitle {
      font-size: 14pt;
      color: #2e5b3e;
      font-weight: 600;
      margin-bottom: 30px;
    }
    a {
      color: #2e5b3e;
      text-decoration: underline;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'Group_7_Final_Report.html'), completeHtml, 'utf8');
console.log('Successfully generated Group_7_Final_Report.html');

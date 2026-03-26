param(
  [string]$HtmlPath = (Join-Path $PSScriptRoot 'LEARNING_BOOK.html'),
  [string]$SourcePath = (Join-Path $PSScriptRoot 'AI-BUILDER-MANUAL-v1.1.md')
)

$ErrorActionPreference = 'Stop'

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$html = [System.IO.File]::ReadAllText($HtmlPath, [System.Text.Encoding]::UTF8)
$source = [System.IO.File]::ReadAllText($SourcePath, [System.Text.Encoding]::UTF8).Trim()

$replacement = @"
  <script id="book-source" type="text/plain">
$source
  </script>
"@

$pattern = '<script id="book-source" type="text/plain">[\s\S]*?</script>'
$updated = [System.Text.RegularExpressions.Regex]::Replace($html, $pattern, $replacement, 1)

if ($updated -eq $html) {
  throw "book-source block not found"
}

[System.IO.File]::WriteAllText($HtmlPath, $updated, $utf8NoBom)
Write-Host "Synced $SourcePath -> $HtmlPath"

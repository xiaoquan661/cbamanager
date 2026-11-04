Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$proj = Split-Path $PSScriptRoot -Parent
$root = Join-Path $proj "dist\stage"
$out  = Join-Path $proj "dist\cba-lamps-upload.zip"
if (Test-Path $out) { Remove-Item $out -Force }

$zip = [System.IO.Compression.ZipFile]::Open($out, [System.IO.Compression.ZipArchiveMode]::Create)
try {
  Get-ChildItem -Path $root -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($root.Length + 1).Replace('\', '/')
    [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal)
  }
} finally { $zip.Dispose() }

$z = [System.IO.Compression.ZipFile]::OpenRead($out)
try {
  $bad = ($z.Entries | Where-Object { $_.FullName -like "*\*" }).Count
  "entries: $($z.Entries.Count)  backslash: $bad"
  $z.Entries | Where-Object { $_.FullName -eq "index.html" -or $_.FullName -eq "assets/lamps/cba-lamps-glue.js" -or $_.FullName -eq "cba-startup.js" } | ForEach-Object { "  $($_.FullName)  $($_.Length)" }
} finally { $z.Dispose() }
Get-Item $out | ForEach-Object { "size: $($_.Length)  time: $($_.LastWriteTime)" }

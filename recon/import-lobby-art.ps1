Add-Type -AssemblyName System.Drawing

$src = "C:\Users\xiaoquan\AppData\Local\Temp\claude\C--10-19--\16c09ff0-4e15-4073-87a9-ebc293ad3262\images"
$proj = Split-Path $PSScriptRoot -Parent
$outDir = Join-Path $proj "assets\lobby"
New-Item -ItemType Directory -Force $outDir | Out-Null

$map = @(
  @{ src = "14.png"; dst = "lobby-arena.jpg"; w = 1400 },
  @{ src = "15.png"; dst = "lobby-signing.jpg"; w = 1400 },
  @{ src = "16.png"; dst = "lobby-trophy.jpg"; w = 1400 },
  @{ src = "17.png"; dst = "lobby-duel.jpg"; w = 1400 },
  @{ src = "18.png"; dst = "lobby-star.jpg"; w = 1400 }
)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$enc = New-Object System.Drawing.Imaging.EncoderParameters(1)
$enc.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)

foreach ($m in $map) {
  $img = [System.Drawing.Image]::FromFile((Join-Path $src $m.src))
  $h = [int]([math]::Round($img.Height * $m.w / $img.Width))
  $bmp = New-Object System.Drawing.Bitmap($m.w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($img, 0, 0, $m.w, $h)
  $g.Dispose()
  $dest = Join-Path $outDir $m.dst
  $bmp.Save($dest, $codec, $enc)
  $bmp.Dispose(); $img.Dispose()
  $kb = [math]::Round((Get-Item $dest).Length / 1024)
  Write-Output ("{0}  {1}x{2}  {3} KB" -f $m.dst, $m.w, $h, $kb)
}

Add-Type -AssemblyName System.Drawing
$src = "C:\Users\xiaoquan\AppData\Local\Temp\claude\C--10-19--\16c09ff0-4e15-4073-87a9-ebc293ad3262\images\22.png"
$proj = Split-Path $PSScriptRoot -Parent
$outDir = Join-Path $proj "assets\lobby"
$dest = Join-Path $outDir "lobby-star.jpg"

$img = [System.Drawing.Image]::FromFile($src)
$w = 1400
$h = [int]([math]::Round($img.Height * $w / $img.Width))
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($img, 0, 0, $w, $h)
$g.Dispose()

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$enc = New-Object System.Drawing.Imaging.EncoderParameters(1)
$enc.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]86)
$bmp.Save($dest, $codec, $enc)
$bmp.Dispose(); $img.Dispose()
Write-Output ("lobby-star.jpg  {0}x{1}  {2} KB" -f $w, $h, [math]::Round((Get-Item $dest).Length / 1024))

Add-Type -AssemblyName System.Drawing
$orig = [System.Drawing.Image]::FromFile('C:\Proyecto_2026\HSPichanga\mobile\assets\adaptive-icon.png')
$bmp = New-Object System.Drawing.Bitmap($orig.Width, $orig.Height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::Transparent)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$scale = 0.6
$newWidth = [int]($orig.Width * $scale)
$newHeight = [int]($orig.Height * $scale)
$x = ($orig.Width - $newWidth) / 2
$y = ($orig.Height - $newHeight) / 2
$g.DrawImage($orig, [int]$x, [int]$y, $newWidth, $newHeight)
$bmp.Save('C:\Proyecto_2026\HSPichanga\mobile\assets\adaptive-icon-padded.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$orig.Dispose()
$bmp.Dispose()

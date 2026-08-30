param([string]$RepoRoot = (Split-Path -Parent $PSScriptRoot))

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'
$sourcePath = Join-Path $RepoRoot 'assets\source\formatlens-logo-master.png'
$iconDir = Join-Path $RepoRoot 'icons'
$storeDir = Join-Path $RepoRoot 'store-assets'
New-Item -ItemType Directory -Force -Path $iconDir,$storeDir | Out-Null
$master = [System.Drawing.Image]::FromFile($sourcePath)

function New-Canvas([int]$width,[int]$height,[string]$path,[scriptblock]$paint) {
  $bitmap = New-Object System.Drawing.Bitmap($width,$height,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  & $paint $graphics $width $height
  $bitmap.Save($path,[System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose(); $bitmap.Dispose()
}

function Add-Logo($graphics,[int]$x,[int]$y,[int]$size) {
  $graphics.DrawImage($master,(New-Object System.Drawing.Rectangle($x,$y,$size,$size)))
}

function New-RoundRect([float]$x,[float]$y,[float]$width,[float]$height,[float]$radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $radius * 2
  $path.AddArc($x,$y,$diameter,$diameter,180,90)
  $path.AddArc($x+$width-$diameter,$y,$diameter,$diameter,270,90)
  $path.AddArc($x+$width-$diameter,$y+$height-$diameter,$diameter,$diameter,0,90)
  $path.AddArc($x,$y+$height-$diameter,$diameter,$diameter,90,90)
  $path.CloseFigure()
  return $path
}

function Add-Text($graphics,[string]$text,[float]$x,[float]$y,[float]$size,[System.Drawing.Color]$color,[string]$family='Segoe UI',[System.Drawing.FontStyle]$style=[System.Drawing.FontStyle]::Regular) {
  $font = New-Object System.Drawing.Font($family,$size,$style,[System.Drawing.GraphicsUnit]::Pixel)
  $brush = New-Object System.Drawing.SolidBrush($color)
  $graphics.DrawString($text,$font,$brush,$x,$y)
  $font.Dispose(); $brush.Dispose()
}

foreach ($size in 16,32,48,128) {
  New-Canvas $size $size (Join-Path $iconDir "icon$size.png") {
    param($g,$w,$h)
    $g.Clear([System.Drawing.Color]::Transparent)
    $padding = [Math]::Max(1,[Math]::Round($w * 0.04))
    $targetWidth = $w - ($padding * 2)
    $targetHeight = $h - ($padding * 2)
    $target = New-Object System.Drawing.Rectangle($padding,$padding,$targetWidth,$targetHeight)
    $g.DrawImage($master,$target)
  }
}

New-Canvas 300 300 (Join-Path $storeDir 'store-logo-300.png') {
  param($g,$w,$h)
  $g.Clear([System.Drawing.Color]::FromArgb(248,250,255))
  Add-Logo $g 22 22 256
}

function Paint-BrandTile($g,[int]$w,[int]$h,[bool]$large) {
  $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle(0,0,$w,$h)),[System.Drawing.Color]::FromArgb(10,19,43),[System.Drawing.Color]::FromArgb(36,34,102),20)
  $g.FillRectangle($background,0,0,$w,$h); $background.Dispose()
  $logoSize = if ($large) { 360 } else { 170 }
  $logoX = if ($large) { 80 } else { 24 }
  $logoY = [Math]::Round(($h-$logoSize)/2)
  Add-Logo $g $logoX $logoY $logoSize
  $textX = if ($large) { 500 } else { 205 }
  $titleSize = if ($large) { 78 } else { 34 }
  $tagSize = if ($large) { 31 } else { 15 }
  $startY = if ($large) { 145 } else { 75 }
  Add-Text $g 'FormatLens' $textX $startY $titleSize ([System.Drawing.Color]::White) 'Segoe UI' ([System.Drawing.FontStyle]::Bold)
  Add-Text $g 'See structure. Keep context.' $textX ($startY+$titleSize+12) $tagSize ([System.Drawing.Color]::FromArgb(109,225,255))
  if ($large) { Add-Text $g 'Private, local-only JSON and technical text formatting' $textX ($startY+$titleSize+$tagSize+42) 24 ([System.Drawing.Color]::FromArgb(199,209,235)) }
}

New-Canvas 440 280 (Join-Path $storeDir 'small-promo-440x280.png') { param($g,$w,$h) Paint-BrandTile $g $w $h $false }
New-Canvas 1400 560 (Join-Path $storeDir 'large-promo-1400x560.png') { param($g,$w,$h) Paint-BrandTile $g $w $h $true }
New-Canvas 1280 640 (Join-Path $storeDir 'github-social-preview-1280x640.png') { param($g,$w,$h) Paint-BrandTile $g $w $h $true }

function Paint-ScreenshotBase($g,[int]$w,[int]$h,[string]$headline,[string]$subhead) {
  $g.Clear([System.Drawing.Color]::FromArgb(8,15,34))
  Add-Text $g $headline 54 42 42 ([System.Drawing.Color]::White) 'Segoe UI' ([System.Drawing.FontStyle]::Bold)
  Add-Text $g $subhead 56 96 20 ([System.Drawing.Color]::FromArgb(148,168,211))
}

New-Canvas 1280 800 (Join-Path $storeDir 'screenshot-1-pretty-1280x800.png') {
  param($g,$w,$h)
  Paint-ScreenshotBase $g $w $h 'Format payloads without leaving the page' 'Select technical text, then inspect a readable copy in the side panel.'
  $left = New-RoundRect 54 158 720 580 18; $right = New-RoundRect 804 158 422 580 18
  $g.FillPath((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245,247,251))),$left)
  $g.FillPath((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(21,31,51))),$right)
  Add-Text $g 'Request Payload' 88 194 21 ([System.Drawing.Color]::FromArgb(24,32,51)) 'Segoe UI' ([System.Drawing.FontStyle]::Bold)
  Add-Text $g '{"order":{"id":"ORD-1042","customer":{"name":"Asha"},"items":[{"action":"add"}]}}' 88 252 15 ([System.Drawing.Color]::FromArgb(63,74,100)) 'Consolas'
  Add-Logo $g 828 179 48; Add-Text $g 'FormatLens' 886 184 22 ([System.Drawing.Color]::White) 'Segoe UI' ([System.Drawing.FontStyle]::Bold)
  Add-Text $g 'JSON detected' 832 252 14 ([System.Drawing.Color]::FromArgb(118,223,183))
  $json = "{`n  `"order`": {`n    `"id`": `"ORD-1042`",`n    `"customer`": {`n      `"name`": `"Asha`"`n    },`n    `"items`": [`n      { `"action`": `"add`" }`n    ]`n  }`n}"
  Add-Text $g $json 832 292 16 ([System.Drawing.Color]::FromArgb(218,229,255)) 'Consolas'
  $left.Dispose(); $right.Dispose()
}

New-Canvas 1280 800 (Join-Path $storeDir 'screenshot-2-tree-1280x800.png') {
  param($g,$w,$h)
  Paint-ScreenshotBase $g $w $h 'Explore JSON as a collapsible tree' 'Search values and copy an exact value or JSON path in one click.'
  $card = New-RoundRect 170 158 940 580 18
  $g.FillPath((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(21,31,51))),$card)
  Add-Logo $g 204 182 48; Add-Text $g 'FormatLens' 262 188 22 ([System.Drawing.Color]::White) 'Segoe UI' ([System.Drawing.FontStyle]::Bold)
  Add-Text $g 'Search: customer' 204 260 17 ([System.Drawing.Color]::FromArgb(148,168,211))
  $tree = "› Object (1)        $`n  › order: Object (3)        $.order`n      id: `"ORD-1042`"        $.order.id`n    › customer: Object (1)    $.order.customer`n        name: `"Asha`"        $.order.customer.name`n    › items: Array (1)        $.order.items"
  Add-Text $g $tree 218 322 20 ([System.Drawing.Color]::FromArgb(218,229,255)) 'Consolas'
  Add-Text $g 'VALUE' 850 450 13 ([System.Drawing.Color]::FromArgb(109,225,255)) 'Segoe UI' ([System.Drawing.FontStyle]::Bold)
  Add-Text $g 'PATH' 948 450 13 ([System.Drawing.Color]::FromArgb(109,225,255)) 'Segoe UI' ([System.Drawing.FontStyle]::Bold)
  $card.Dispose()
}

New-Canvas 1280 800 (Join-Path $storeDir 'screenshot-3-private-1280x800.png') {
  param($g,$w,$h)
  Paint-ScreenshotBase $g $w $h 'Private by design' 'Formatting happens locally in your browser—no account, backend, analytics, or network transmission.'
  Add-Logo $g 390 190 500
  $pill = New-RoundRect 360 660 560 58 29
  $g.FillPath((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(28,49,80))),$pill)
  Add-Text $g 'LOCAL PROCESSING • NO DATA COLLECTION' 430 677 18 ([System.Drawing.Color]::FromArgb(109,225,255)) 'Segoe UI' ([System.Drawing.FontStyle]::Bold)
  $pill.Dispose()
}

$master.Dispose()
Write-Output "Generated FormatLens icons and store artwork in $RepoRoot"

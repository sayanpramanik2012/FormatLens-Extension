param([string]$RepoRoot = (Split-Path -Parent $PSScriptRoot))

$ErrorActionPreference = 'Stop'
$manifestPath = Join-Path $RepoRoot 'manifest.json'
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$required = @('manifest.json','background.js','content.js','sidepanel.html','sidepanel.css','sidepanel.js','icons')
foreach ($item in $required) {
  if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot $item))) { throw "Missing required package item: $item" }
}
$releaseDir = Join-Path $RepoRoot 'release'
New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null
$zipPath = Join-Path $releaseDir "FormatLens-v$($manifest.version)-edge.zip"
if (Test-Path -LiteralPath $zipPath) { Remove-Item -LiteralPath $zipPath -Force }
$packageItems = $required | ForEach-Object { Join-Path $RepoRoot $_ }
Compress-Archive -LiteralPath $packageItems -DestinationPath $zipPath -CompressionLevel Optimal

$verifyDir = Join-Path ([System.IO.Path]::GetTempPath()) "formatlens-package-$([guid]::NewGuid().ToString('N'))"
try {
  Expand-Archive -LiteralPath $zipPath -DestinationPath $verifyDir -Force
  $packedManifest = Get-Content -LiteralPath (Join-Path $verifyDir 'manifest.json') -Raw | ConvertFrom-Json
  if ($packedManifest.name -ne 'FormatLens') { throw 'Packaged manifest name is incorrect.' }
  foreach ($size in 16,32,48,128) {
    if (-not (Test-Path -LiteralPath (Join-Path $verifyDir "icons\icon$size.png"))) { throw "Packaged icon$size.png is missing." }
  }
} finally {
  if (Test-Path -LiteralPath $verifyDir) { Remove-Item -LiteralPath $verifyDir -Recurse -Force }
}
Write-Output "Verified Edge package: $zipPath ($((Get-Item -LiteralPath $zipPath).Length) bytes)"

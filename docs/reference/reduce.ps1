<#
  reduce.ps1  Move duplicate and stale ClearGrid files into _archive. Never deletes.

  .\reduce.ps1                          dry run: prints every move, changes nothing
  .\reduce.ps1 -Apply                   does the moves
  .\reduce.ps1 -Undo <moves.csv> -Apply puts the files back

  Reads manifest.csv (same folder). Acts only on rows with action = archive or drop.
  Before any move it re-hashes the file (and, for drop, its canonical copy). A mismatch skips the row.
  drop    -> <root>\_archive\<date>\_duplicates\<same path>
  archive -> <root>\_archive\<date>\<same path>
  A log, moves.csv, is written next to each archive folder. Files under .git never move.
#>
param(
  [string]$Manifest = (Join-Path $PSScriptRoot 'manifest.csv'),
  [string]$Undo,
  [switch]$Apply,
  [string[]]$Roots = @('C:\Users\dell\OneDrive\Documents\cleargrid', 'C:\cleargrid-profile')
)
$ErrorActionPreference = 'Stop'
$S = [IO.Path]::DirectorySeparatorChar
$date = Get-Date -Format 'yyyy-MM-dd'
function Sha($p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLower() }

if ($Undo) {
  foreach ($m in Import-Csv $Undo) {
    if (-not (Test-Path -LiteralPath $m.to)) { Write-Host "SKIP missing  $($m.to)"; continue }
    if (Test-Path -LiteralPath $m.from) { Write-Host "SKIP exists   $($m.from)"; continue }
    Write-Host "RESTORE       $($m.from)"
    if ($Apply) {
      New-Item -ItemType Directory -Force -Path (Split-Path $m.from) | Out-Null
      Move-Item -LiteralPath $m.to -Destination $m.from
    }
  }
  if (-not $Apply) { Write-Host 'DRY RUN. Add -Apply to restore.' }
  return
}

$roots = $Roots | ForEach-Object { $_.TrimEnd('\', '/') + $S }
$rows = Import-Csv $Manifest | Where-Object {
  ($_.action -eq 'archive' -or $_.action -eq 'drop') -and ($_.place -eq 'C' -or $_.place -eq 'OneDrive') -and $_.path -notmatch '!'
}

# Pass 1: validate everything. No move happens here.
$plan = @()
foreach ($r in $rows) {
  if ($r.path -match '[\\/]\.git[\\/]') { Write-Host "REFUSE        git file $($r.path)"; continue }
  if (-not (Test-Path -LiteralPath $r.path)) { Write-Host "SKIP missing  $($r.path)"; continue }
  if ((Sha $r.path) -ne $r.sha256) { Write-Host "SKIP changed  $($r.path)"; continue }
  if ($r.action -eq 'drop') {
    if (-not (Test-Path -LiteralPath $r.canonical_copy) -or (Sha $r.canonical_copy) -ne $r.sha256) {
      Write-Host "SKIP no verified canonical copy  $($r.path)"; continue
    }
  }
  $root = $roots | Where-Object { $r.path.StartsWith($_, [StringComparison]::OrdinalIgnoreCase) } | Select-Object -First 1
  if (-not $root) { Write-Host "SKIP outside roots  $($r.path)"; continue }
  $dir = Join-Path (Join-Path $root '_archive') $date
  if ($r.action -eq 'drop') { $dir = Join-Path $dir '_duplicates' }
  $to = Join-Path $dir $r.path.Substring($root.Length)
  if (Test-Path -LiteralPath $to) { Write-Host "SKIP target exists  $to"; continue }
  $plan += [pscustomobject]@{ action = $r.action; from = $r.path; to = $to; sha256 = $r.sha256; root = $root }
}

foreach ($m in $plan) { Write-Host ('{0,-8}{1}  ->  {2}' -f $m.action, $m.from, $m.to) }
$nA = @($plan | Where-Object { $_.action -eq 'archive' }).Count
$nD = @($plan | Where-Object { $_.action -eq 'drop' }).Count
Write-Host "`n$($nA + $nD) moves: $nA archive, $nD drop."
if (-not $Apply) { Write-Host 'DRY RUN. Nothing moved. Add -Apply to do it.'; return }

# Pass 2: move and log.
foreach ($m in $plan) {
  New-Item -ItemType Directory -Force -Path (Split-Path $m.to) | Out-Null
  Move-Item -LiteralPath $m.from -Destination $m.to
  $log = Join-Path (Join-Path (Join-Path $m.root '_archive') $date) 'moves.csv'
  $m | Select-Object action, from, to, sha256 | Export-Csv -Path $log -Append -NoTypeInformation -Encoding UTF8
}
Write-Host 'Done. Empty folders may remain. Remove them by hand. Undo with -Undo <moves.csv> -Apply.'

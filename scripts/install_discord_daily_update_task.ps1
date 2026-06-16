param(
    [string]$TaskName = "ATLAS Daily Discord Update",
    [string]$Time = "3:00 PM"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-RepoRoot {
    return (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
}

function Load-EnvFile {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        return
    }

    foreach ($line in Get-Content -LiteralPath $Path) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        if ($line.TrimStart().StartsWith("#")) { continue }
        $parts = $line -split "=", 2
        if ($parts.Count -ne 2) { continue }
        [Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
    }
}

$repoRoot = Get-RepoRoot
Load-EnvFile -Path (Join-Path $repoRoot ".env")
Load-EnvFile -Path (Join-Path $repoRoot ".env.local")
Load-EnvFile -Path (Join-Path $repoRoot ".env.discord")

$senderScript = Join-Path $repoRoot "scripts\discord_daily_update_sender.ps1"
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$senderScript`""
$trigger = New-ScheduledTaskTrigger -Daily -At $Time
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description "Daily ATLAS Discord update for Catherine / rebootingsoul." -Force | Out-Null

$hasToken = -not [string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable("DISCORD_BOT_TOKEN", "Process"))
$hasUserId = -not [string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable("DISCORD_TARGET_USER_ID", "Process"))

if (-not ($hasToken -and $hasUserId)) {
    Disable-ScheduledTask -TaskName $TaskName | Out-Null
    $missing = @()
    if (-not $hasToken) { $missing += "DISCORD_BOT_TOKEN" }
    if (-not $hasUserId) { $missing += "DISCORD_TARGET_USER_ID" }
    Write-Host ("Scheduled task created but disabled until {0} {1} configured." -f ($missing -join " and "), ($(if ($missing.Count -gt 1) { "are" } else { "is" })))
    exit 0
}

Enable-ScheduledTask -TaskName $TaskName | Out-Null
Write-Host "Scheduled task created and enabled for $Time."

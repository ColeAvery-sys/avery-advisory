param(
    [string]$TaskName = "ATLAS Discord Bot"
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

$botScript = Join-Path $repoRoot "scripts\atlas_discord_bot.py"
$action = New-ScheduledTaskAction -Execute "python.exe" -Argument "`"$botScript`""
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description "Runs the ATLAS Discord bot for Hey Atlas replies and check-in reminders." -Force | Out-Null

$hasToken = -not [string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable("DISCORD_BOT_TOKEN", "Process"))
$hasOwner = -not [string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable("DISCORD_OWNER_USER_ID", "Process"))

if (-not ($hasToken -and $hasOwner)) {
    Disable-ScheduledTask -TaskName $TaskName | Out-Null
    $missing = @()
    if (-not $hasToken) { $missing += "DISCORD_BOT_TOKEN" }
    if (-not $hasOwner) { $missing += "DISCORD_OWNER_USER_ID" }
    Write-Host ("Scheduled task created but disabled until {0} {1} configured." -f ($missing -join " and "), ($(if ($missing.Count -gt 1) { "are" } else { "is" })))
    exit 0
}

Enable-ScheduledTask -TaskName $TaskName | Out-Null
Write-Host "ATLAS Discord bot task created and enabled."

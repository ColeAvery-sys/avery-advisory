param(
    [switch]$DryRun,
    [string]$MessageFile,
    [string]$RecipientUserId
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
        $name = $parts[0].Trim()
        $value = $parts[1].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

function Write-RunLog {
    param(
        [string]$LogPath,
        [string]$Message
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -LiteralPath $LogPath -Value "[$timestamp] $Message"
}

function Get-MessageContent {
    param(
        [string]$TemplatePath
    )

    if (-not (Test-Path -LiteralPath $TemplatePath)) {
        throw "Message template not found: $TemplatePath"
    }

    $content = Get-Content -LiteralPath $TemplatePath -Raw
    $today = Get-Date -Format "MMMM d, yyyy"
    $time = Get-Date -Format "h:mm tt"
    return $content.Replace("{{DATE}}", $today).Replace("{{TIME}}", $time).Trim()
}

function Send-DiscordMessage {
    param(
        [string]$BotToken,
        [string]$UserId,
        [string]$Content
    )

    $headers = @{
        Authorization = "Bot $BotToken"
        "Content-Type" = "application/json"
    }

    $channelBody = @{ recipient_id = $UserId } | ConvertTo-Json -Compress
    $channel = Invoke-RestMethod -Method Post -Uri "https://discord.com/api/v10/users/@me/channels" -Headers $headers -Body $channelBody

    $messageBody = @{ content = $Content } | ConvertTo-Json -Compress -Depth 4
    return Invoke-RestMethod -Method Post -Uri "https://discord.com/api/v10/channels/$($channel.id)/messages" -Headers $headers -Body $messageBody
}

$repoRoot = Get-RepoRoot
Load-EnvFile -Path (Join-Path $repoRoot ".env")
Load-EnvFile -Path (Join-Path $repoRoot ".env.local")
Load-EnvFile -Path (Join-Path $repoRoot ".env.discord")

$logDir = Join-Path $repoRoot "atlas_ops\logs"
New-Item -ItemType Directory -Path $logDir -Force | Out-Null
$logPath = Join-Path $logDir "discord_daily_update.log"

$botToken = [Environment]::GetEnvironmentVariable("DISCORD_BOT_TOKEN", "Process")
$userId = if ($RecipientUserId) { $RecipientUserId } else { [Environment]::GetEnvironmentVariable("DISCORD_TARGET_USER_ID", "Process") }
$templatePath = if ($MessageFile) {
    $MessageFile
} else {
    $configured = [Environment]::GetEnvironmentVariable("DISCORD_DAILY_MESSAGE_FILE", "Process")
    if ($configured) {
        if ([System.IO.Path]::IsPathRooted($configured)) { $configured } else { Join-Path $repoRoot $configured }
    } else {
        Join-Path $repoRoot "atlas_ops\discord\Catherine_daily_update.txt"
    }
}

$message = Get-MessageContent -TemplatePath $templatePath
if ($message.Length -gt 2000) {
    throw "Discord message exceeds 2000 character limit."
}

if ($DryRun) {
    Write-Host "Dry run only. Target user: $userId"
    Write-Host ""
    Write-Host $message
    Write-RunLog -LogPath $logPath -Message "Dry run completed for user $userId."
    exit 0
}

if (-not $botToken) {
    Write-RunLog -LogPath $logPath -Message "Skipped send: DISCORD_BOT_TOKEN is not configured."
    throw "DISCORD_BOT_TOKEN is not configured."
}

if (-not $userId) {
    Write-RunLog -LogPath $logPath -Message "Skipped send: DISCORD_TARGET_USER_ID is not configured."
    throw "DISCORD_TARGET_USER_ID is not configured."
}

$result = Send-DiscordMessage -BotToken $botToken -UserId $userId -Content $message
Write-RunLog -LogPath $logPath -Message "Sent daily update to user $userId in channel $($result.channel_id)."
Write-Host "Message sent to Discord user $userId."

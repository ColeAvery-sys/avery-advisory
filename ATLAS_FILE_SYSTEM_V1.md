# ATLAS File System Layer V1

Date: 2026-06-11

## Mission

Create the ATLAS working surface for files.
Files store work.
ATLAS must understand, organize, and manipulate files safely.

## Scope

File System Layer V1 must support:

- file discovery
- folder discovery
- file reading
- file writing
- file creation
- folder creation
- file movement
- file copying
- file renaming
- file deletion
- file metadata tracking
- project linking
- task linking
- memory linking
- contact linking
- indexed file discovery
- permission validation
- operation logging through the Memory Engine

## Permissions

Support:

- Read
- Write
- Admin

Suggested policy:

- Read: read and search
- Write: create, update, move, copy, rename, and link
- Admin: destructive operations such as delete

## Metadata

Track:

- file path
- created date
- modified date
- file type
- file size
- associated project
- associated tasks
- associated memories
- associated contacts

## File Index

ATLAS must maintain a persisted file index so future AI systems can discover files quickly.

## Logging

Every operation must be logged with:

- timestamp
- operation
- target file
- result
- duration

Logs are stored in the Memory Engine action log.

## Definition Of Done

File System Layer V1 is complete when ATLAS can:

- discover files
- read files
- write files
- organize files
- link files to projects
- search files
- track metadata

and all tests pass.

## Out Of Scope

- Dashboard
- Voice
- Discord
- Telegram
- Calendar
- Email

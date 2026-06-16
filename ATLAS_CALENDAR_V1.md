# ATLAS Calendar Integration V1

Date: 2026-06-11

## Mission

Connect ATLAS to Google Calendar in a schedule-aware way.

Calendar V1 is the executive scheduling layer on top of the ATLAS core.

## Scope

Calendar V1 must support:

- reading upcoming events
- reading today's schedule
- reading weekly schedule
- creating events
- creating reminders
- creating recurring events
- moving events
- editing events
- cancelling events
- finding events by name, date, or participant
- linking events to memories, tasks, and projects
- logging every event create/update/delete action into the Memory Engine

## Integration Rules

- Calendar events become Memory objects.
- Calendar events may link to Tasks and Projects.
- Calendar events may store linked memory references.
- The dashboard does not own calendar data.
- Voice does not own calendar data.
- Calendar state is a core service concern.

## Conflict Detection

ATLAS must detect:

- overlapping meetings
- double booking
- missing deadlines

## Logging

Log these actions into the Memory Engine:

- Calendar Event Created
- Calendar Event Updated
- Calendar Event Deleted
- Calendar Event Read
- Calendar Event Searched
- Calendar Conflict Detected

## Definition Of Done

Calendar V1 is complete when ATLAS can:

- read events
- create events
- edit events
- delete events
- detect conflicts
- validate event links

and all tests pass.

## Out Of Scope

- Dashboard UI
- Voice UI
- Email integration
- Discord integration
- Telegram integration

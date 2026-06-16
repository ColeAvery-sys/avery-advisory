# ATLAS Capture Engine V1

Date: 2026-06-11

## Mission

Create a single intake pipeline for ATLAS so text and connected interface inputs can be classified, logged, and routed into the Memory Engine.

## Pipeline

Input sources:

- Text
- Voice
- Dashboard
- Telegram
- Discord
- Email

Flow:

1. Capture Engine receives raw input.
2. Classifier assigns object type, priority, category, and entities.
3. Capture log is written.
4. Memory Engine receives the downstream object.

## Required Output Types

- Task
- Project
- Goal
- Memory
- Journal Entry
- Contact
- Knowledge

## Priority Levels

- Critical
- High
- Medium
- Low

## Entity Linking

Capture Engine should detect and attach references for:

- People
- Companies
- Projects
- Locations

## Logging

Every capture record must store:

- original input
- classification
- timestamp
- confidence score

## Definition Of Done

Capture Engine V1 is complete when:

- task classification works
- goal classification works
- journal classification works
- project classification works
- entity linking works
- errors are handled safely

## Out Of Scope

- Dashboard
- Voice UI
- Discord UI
- Telegram UI
- Email UI
- Strategic Advisor

# Ephemeris

> Version 2.0

## About

## Main functionality

- Add to unable
  - > Run by user
  - User determines on a per engagement basis, whether they can attend
- Hand in report
  - > Run by user
  - User updates the engagement document with the visitor amount and type
  - Update ArchiveCache
- Schedule
  - > Run by admin
  - for each engagement
    - ignore unable
    - else:
      1.  highest deficit
      2.  longest time since demo
      3.  random tiebreak

## Frontend

### Pages

- Layout
  - navbar
    - signout
  - next year
    - archive
    - admin:
      - schedule
- Main page
  - Monthly overview
  - "Edit mode"
  - toggle click to mark able/unable
  - click day to open modal form for engagement info
  - click demonstrator to download calendar
- Archive page
  - Overview page, lists every "archive" per year
  - Detail page, lists all caches, calendar for detail information below.

## Database

### Collections

- Demonstrators
- Engagements
- EngagementTypes
- VisitorTypes
- Archives
- Warnings
- LTS

### Types

- Demonstrator
  - name: string
  - id: uuid
  - sunlab: boolean
- Engagement
  - date: Date
  - assignedUserID: uuid[]
  - engagementType?: EngagementType
  - visitorType?: VisitorType
  - visitorNumber?: number
  - unable: uuid[]
  - id: uuid
- EngagementType
  - Mittwoch
  - Sonnenlabor
  - Gruppen
- VisitorType
  - öffentlich
  - Schule
  - Privat
- ArchiveCache
  > Cached values for archival statistics
  - numEngagements: number
  - EngagementsPerUser: Map<uuid, number>
  - totalVisitors: number
  - totalSchools: number
  - totalPrivate: number
- Archive
  - year: number
  - sunlab: uuid -> LTS
  - regular: uuid -> LTS
  - engagements: uuid[] -> LTS

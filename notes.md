# Data

## Users

- id
- username

## Boards

- id
- title
- createdBy
- createdAt
- votesAllowed

## Columns

- id
- boardId
- title
- createdBy
- createdAt
- position

## Cards

- id
- columnId (null is trash)
- content
- createdBy
- createdAt
- updatedBy
- updatedAt
- position

## Votes

- cardId

## Timers

- id
- boardId
- minutes
- startedAt



# Endpoints

POST /api/login
  - In
    - username
  - Out
    - username
    - token

// Get all info on a board
GET /api/boards
  - Out
    - [{
        id
        title
        createdBy (resolved user)
        createdAt
       }, {}, ...]

// Create a new board
POST /api/boards
  - In
    - title
    - votesAllowed (optional)
  - Out
    - {¿everything?}

// Get all info on a board
GET /api/boards/4
  - Out
    - {
      id,
      title,
      createdBy, (resolved user)
      createdAt,
      votesAllowed,
      columns: [
        {
          id,
          title,
          createdBy,
          createdAt,
          position,
          cards: [
            {
              id,
              content,
              createdBy,
              createdAt,
              position,
              votes
            }, ...
          ]
        }, ...
      ]
    }

// Create a column
POST /api/boards/4/column
  - In
    - title
  - Out
    - {everything}

// Rename a column
PATCH /api/boards/4/column/9
  - In
    - title
  - Out
    - {everything}

// Get my own votes
GET /api/boards/4/votes/7
  - (boardId / userId)
  - Out
    - [
        { cardId: 3, votes: 1 },
        { cardId: 7, votes: 2 },
        ...
      ]

NOT NEEDED
GET /api/boards/4/cards/2
  - (boardId / cardId)
  - Out
    - {
          id,
          content,
          createdBy,
          createdAt,
          position,
          votes
        }

// Update a card
PATCH /api/boards/4/cards/2
  - (boardId / cardId)
  - In
    - "content=new%20content"
  - Out
    - {
          id,
          content,
          createdBy,
          createdAt,
          position,
          votes
        }

// Add a vote
POST /api/boards/4/cards/2/vote/7
  - (boardId / cardId / userId)
  - In: ""
  - Out: 200

TBD:
  - reordering of
    - Columns
    - Cards
  - Export




















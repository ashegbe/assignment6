# Assignment 6: Triviabook

## Database schema
## Deployment Link: 
https://assignment6-p1pj.onrender.com/triviabook/random
**topics**

| Column | TYPE    |

| id     | SERIAL  |    
| name   | TEXT    |    

**questions**


| id         | SERIAL  |  
| topic_id   | INTEGER |
| question   | TEXT    | 
| answer     | TEXT    |
| difficulty | TEXT    |

## Setup

1. Clone the repository and open it in VS Code.
2. Run `npm install`.
3. Create a Postgres project on Neon and copy its connection string.
4. Create a `.env` file in the project root:
5. Run `npm run seed` to create the tables and load the seed data.
6. Run `npm start`. The server listens on port 3000.



## Endpoints



| GET | `/topics` | Returns a list of all topics |
| GET | `/topic/:topic` | Returns the questions for a topic |
| GET | `/random` | Returns one random question (no answer) |
| POST | `/answer` | Checks a guess for a question |
| POST | `/question/add` | Adds a new question |


# Family Movie Watchlist API

A REST API where each family member keeps their own movie watchlist. Login returns a signed JWT, and role-based rules decide who can change what: **parents can modify any watchlist; children can only modify their own.**

**Live demo:** https://kerens-movie-watchlist-api.onrender.com

> The demo runs on a free instance, so the first request after a quiet period can take up to a minute. Data is stored in a JSON file and resets whenever the server restarts.

## Tech

Node.js, Express 5, JWT (`jsonwebtoken`), `bcryptjs`, Helmet

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | none | Returns a JWT |
| GET | `/api/watchlist/:userId` | token | View a watchlist |
| POST | `/api/watchlist/:userId/movies` | token + role rule | Add a movie (`title` required, `genre` optional) |
| PUT | `/api/watchlist/:userId/movies/:movieId` | token + role rule | Update a movie |
| DELETE | `/api/watchlist/:userId/movies/:movieId` | token + role rule | Remove a movie |

Errors are JSON with the right status code: 400 (bad input), 401 (missing, invalid, or expired token), 403 (role not allowed), 404 (not found).

## Try it

Demo accounts: `dad_miller` / `parent456` (parent) and `jake_miller` / `child123` (child).

```bash
BASE=https://kerens-movie-watchlist-api.onrender.com

# 1. Log in as a parent and save the token
TOKEN=$(curl -s -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"dad_miller","password":"parent456"}' \
  | sed 's/.*"token":"\([^"]*\)".*/\1/')

# 2. View a watchlist
curl -s $BASE/api/watchlist/2 -H "Authorization: Bearer $TOKEN"

# 3. A parent can add a movie to anyone's list
curl -s -X POST $BASE/api/watchlist/3/movies \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Up","genre":"Animation"}'

# 4. A child cannot edit someone else's list (403)
CHILD=$(curl -s -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"jake_miller","password":"child123"}' \
  | sed 's/.*"token":"\([^"]*\)".*/\1/')
curl -s -X POST $BASE/api/watchlist/1/movies \
  -H "Authorization: Bearer $CHILD" -H "Content-Type: application/json" \
  -d '{"title":"Test"}'
# -> {"error":"Access denied"}
```

## Run locally

```bash
npm install
```

Create a `.env` file with `PORT=3000` and `JWT_SECRET=<a long random string>`, then:

```bash
npm run dev
```
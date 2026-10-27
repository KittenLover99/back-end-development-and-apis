# Authentication and Role-Based Access API

An Express API with registration, login, a protected profile route, logout, and an admin-only route.

**Live demo:** https://kerens-auth-api.onrender.com

> The demo runs on a free instance, so the first request after a quiet period can take up to a minute. Data is stored in a JSON file and resets whenever the server restarts.

## Features

- Passwords hashed with `bcryptjs`
- JWTs that expire after one day
- Token blacklist: logged-out tokens are rejected on later requests
- Reusable `authenticate` and `authorizeRole` middleware
- Admin-only route that returns users without their password hashes
- Central error-handling middleware; secrets kept in environment variables

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | none | Create a user (`email`, `password`) and get a token |
| POST | `/api/auth/login` | none | Log in and get a token |
| GET | `/api/auth/profile` | token | Current user |
| POST | `/api/auth/logout` | token | Invalidate the current token |
| GET | `/api/admin/users` | token + admin role | List users (no password hashes) |

## Try it

```bash
BASE=https://kerens-auth-api.onrender.com

# 1. Register and save the token (use any email)
T=$(curl -s -X POST $BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"MyDemoPass123"}' \
  | sed 's/.*"token":"\([^"]*\)".*/\1/')

# 2. Protected route
curl -s $BASE/api/auth/profile -H "Authorization: Bearer $T"

# 3. A normal user cannot reach the admin route (403)
curl -s $BASE/api/admin/users -H "Authorization: Bearer $T"
# -> {"message":"Access denied"}

# 4. Log out, then reuse the token (401)
curl -s -X POST $BASE/api/auth/logout -H "Authorization: Bearer $T"
curl -s $BASE/api/auth/profile -H "Authorization: Bearer $T"
# -> {"message":"Token has been invalidated. Log in again."}
```

## Run locally

```bash
npm install
```

Create a `.env` file with `PORT=3000` and `JWT_SECRET=<a long random string>`, then:

```bash
npm run dev
```
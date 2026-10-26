import express from "express";
import helmet from "helmet";

import authRoutes from "./routes/auth.js";
import watchlistRoutes from "./routes/watchlist.js";

const PORT = process.env.PORT;
const app = express();

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Family Movie Watchlist API",
    endpoints: {
      login: "POST /api/auth/login",
      viewWatchlist: "GET /api/watchlist/:userId",
      addMovie: "POST /api/watchlist/:userId/movies",
      updateMovie: "PUT /api/watchlist/:userId/movies/:movieId",
      removeMovie: "DELETE /api/watchlist/:userId/movies/:movieId",
    },
    demoLogin: { username: "dad_miller", password: "parent456" },
    docs: "https://github.com/KittenLover99/back-end-development-and-apis/tree/main/build-a-family-movie-watchlist-api",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
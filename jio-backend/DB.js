const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
//const mongoSanitize = require("express-mongo-sanitize"); // ✅ fixed spelling
{
  /*express-mongo-sanitize@2.2.0 was designed around Express 4's request object. In Express 5, 
  req.query is implemented as a getter-only property*/
}
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");

dotenv.config();

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000000000, // ✅ correct option (was "limit")
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Middleware setup
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet()); // ✅ load helmet early

// Sanitize only body and params (skip req.query to avoid read-only error)
//app.use(mongoSanitize());

const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));

// Router imports
const AuthRouter = require("./Routers/AuthRouter");
const MovieRouter = require("./Routers/MovieRouter");
const TvShowsRouter = require("./Routers/TvRouter");
const DiscoverRouter = require("./Routers/DiscoverRouter");
const UserRouter = require("./Routers/UserRouter");
const VideoRouter = require("./Routers/VideoRouter");
// const PaymentRouter = require("./Routers/PaymentRouter");

// Router middleware
app.use("/api/auth", AuthRouter);
app.use("/api/movies", MovieRouter);
app.use("/api/tv", TvShowsRouter);
app.use("/api/discover", DiscoverRouter);
app.use("/api/user", UserRouter);
app.use("/api/video", VideoRouter);
// app.use("/api/payment", PaymentRouter);

// Conditional DB connection and server startup
async function startServer() {
  if (process.env.NODE_ENV !== "test") {
    if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
      console.error(
        "Missing DB_USERNAME or DB_PASSWORD environment variables. Check your .env file.",
      );
    } else {
      try {
        const dbUri =
          process.env.DB_link || "mongodb://127.0.0.1:27017/Jio-clone";
        console.log("Connecting to DB...");
        await mongoose.connect(dbUri);
        console.log("Connected to DB");
      } catch (err) {
        console.error("DB Connection Error:", err);
      }
    }
  }

  const PORT = process.env.NODE_ENV === "test" ? 5000 : process.env.PORT;

  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = { app };

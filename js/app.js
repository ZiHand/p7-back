import express, { json } from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user_routes";
import postRoutes from "./routes/post_routes";
import commentRoutes from "./routes/comment_routes";
import { sync } from "../config/db";
import { checkUser, requireAuth } from "./middlewares/auth_middleware";
import cors from "cors";

import UserModel, { hasMany } from "./models/user_model";
import PostModel, { hasMany as _hasMany, belongsTo } from "./models/post_model";
import CommentModel, { belongsTo as _belongsTo } from "./models/comment_model";

// ===================================================
//                 Express App Creation
// ===================================================
const app = express();

// Ici, Express prend toutes les requêtes qui ont comme Content-Type  application/json
// et met à disposition leur  body  directement sur l'objet req
app.use(json());
app.use(cookieParser());

// ===================================================
//                  cors - Options
// ===================================================
const corsOptions = {
  origin: process.env.ALLOWED_URL, // Set the correct one (you can override it on Heroku.com)
  credentials: true,
  allowedHeaders: [
    "sessionId",
    "Content-Type",
    "Accept",
    "Origin",
    "Authorization",
  ],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

//app.set("trust proxy", 1);
app.use(cors(corsOptions));

// ===================================================
//                 Auth Definitions
// ===================================================
// Apply to all get routes
// ===================================================
//app.options("*", cors(corsOptions));
app.get("*", checkUser);

app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user.id);
});

// ===================================================
//                 Routes Definitions
// ===================================================
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// ===================================================
//                 DB Connection
// ===================================================
hasMany(PostModel, { as: "posts" });
_hasMany(CommentModel, { as: "comments", onDelete: "cascade" });

belongsTo(UserModel);

_belongsTo(PostModel, { onDelete: "cascade" });
_belongsTo(UserModel);

sync()
  .then(() => {
    console.log("Connection to Groupomania DB OK.");
  })
  .catch((error) =>
    console.log("Connection to Groupomania FAILED : " + JSON.stringify(error))
  );

// ===================================================
//                     Export
// ===================================================
export default app;

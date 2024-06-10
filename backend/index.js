import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongo-session";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { GraphQLLocalStrategy, buildContext } from "graphql-passport";

import { connectDB } from "./db/connectDB.js";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import User from "./models/user.model.js";
import { users } from "./dummyData/data.js";
import { configurePassport } from "./passport/passport.config.js";
dotenv.config();

const app = express();

const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (err) => console.log(err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //this option specifies whether to save the session to the store on every request
    saveUninitialized: false,
    cookir: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true, // this option prevents the Cross-Site Scripting (XSS) attacks
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing, and our expressMiddleware function
app.use(
  "/",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);
// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB();
const cat = new User({
  username: "user1",
  name: "User One",
  password: "password1",
  profilePicture: "profile1.jpg",
  gender: "male",
});
const data = await cat.save();
console.log("data =>", data);
app.get("/", async (req, res) => {
  res.send(data);
});
console.log(`rocket - Server ready at http://localhost:4000/`);

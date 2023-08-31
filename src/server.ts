import express, { Application } from "express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { HTTPCodes, bootstrapPath } from "./globalConstants.js";
import homeRoutes from "./routes/home/homeRoutes.js";
import authRoutes from "./routes/auth/authRoutes.js";
import financeRoutes from "./routes/finance/financeRoutes.js";
import { fileURLToPath } from "url";
import { checkUserOrGuest } from "./middlewares/auth/authMiddlewares.js";
// import { typeDefs } from "./models/fitness.js";

// Fetching secret key and MongoDB password
dotenv.config();

// Initalize app
const app: Application = express();

// Finding directory name in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database Connection
const database_name = "lifeStyleWebsite";
const mongoPassword = process.env.mongoPassword;
const dbURI = `mongodb+srv://saeidalz96:${mongoPassword}@saeidpersonal.l1exe7i.mongodb.net/${database_name}?retryWrites=true&w=majority`;
try {
  //... Apollo
  // const apServer = new ApolloServer({
  //   // typeDefs -- definition of types of data
  //   typeDefs,

  //   // resolvers -- to handle incoming requests

  // })

  // const apURL = await startStandaloneServer(apServer, {
  //   listen: { port: 3000 }
  // })
  // console.log("Apollo server ready at port 3000...")

  //... MongoDb
  const responseMongo = await mongoose.connect(dbURI);
  console.log(`Successfully connected to => ${database_name}...`);
  app.listen(3000);
} catch (error) {
  console.log(error);
}

// Parsing all the post requests
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Nessecary middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Set Front-end CSS and React.js
app.use(express.static("public"));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "..", bootstrapPath))
);
// app.use('/client', express.static(path.join(__dirname, 'client/build')));

// Routes
app.get("*", checkUserOrGuest);
app.use(homeRoutes);
app.use(authRoutes);
app.use(financeRoutes);

// app.use((req: Request, res: Response) => {
//   res.status(HTTPCodes.NotFound).render("404", { title: "Not Found" });
// });

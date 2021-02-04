const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

//API security
app.use(helmet());
//handle cors
app.use(cors());
//MONGO_DB setup
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

if (process.env.NODE_ENV !== "production") {
  const mongoDB = mongoose.connection;

  mongoDB.on("open", () => {
    console.log("MongoDB is connected");
  });
  mongoDB.on("error", (error) => {
    console.log(error);
  });


//logger
app.use(morgan("combined"));
}
//set body parser
app.use(express.json());
//load routers

const userRouter = require("./src/Routes/UserRoute");
const ticketRouter = require("./src/Routes/TicketRoute");

//routes

app.use("/user", userRouter);
// app.use("/ticket", ticketRouter);

const port = process.env.PORT || 5000;

//error handling
const handleError = require("./src/utils/ErrorHandler");

app.use((req, res, next) => {
  const error = new Error("Nothing here!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => {
  console.log({ port });
});

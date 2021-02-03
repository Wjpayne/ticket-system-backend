const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

//API security
app.use(helmet());
//handle cors
app.use(cors());
//logger
app.use(morgan("combined"));
//set body parser
app.use(express.json())

//load routers

const userRouter = require("./src/Routes/UserRoute");
const ticketRouter = require("./src/Routes/TicketRoute");

//routes

app.use("/user", userRouter);
app.use("/ticket", ticketRouter);

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

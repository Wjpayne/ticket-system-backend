const { auth } = require("../Middleware/auth");
const { insertTicket, getTickets, getTicketById } = require("../Model/Ticket/TicketModel");
const express = require("express");
const router = express.Router();

router.all("/", (req, res, next) => {
  next();
});

//create a ticket

router.post("/addticket", auth, async (req, res) => {
  try {
    const { subject, sender, message } = req.body;

    const userId = req.userId;

    const ticket = {
      clientId: userId,
      subject,
      conversations: [
        {
          sender,
          message,
        },
      ],
    };

    const result = await insertTicket(ticket);
    if (result._id) {
      return res.json({
        status: "success",
        message: "Ticket has been created!",
      });
    }

    res.json({
      status: "error",
      message: "Unable to create ticket, please try again later",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

//get ticket details for user

router.get("/userticket", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const result = await getTickets(userId);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

//get tickets for a user

router.get("/:_id", auth, async (req, res) => {
  try {
    const { _id } = req.params;

    const clientId = req.userId;
    const result = await getTicketById(_id, clientId);

    return res.json({
      status: "success",
      result,
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});



module.exports = router;

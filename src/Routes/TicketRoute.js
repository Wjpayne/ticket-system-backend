const { auth } = require("../Middleware/auth");
const {
  insertTicket,
  getTickets,
  getTicketById,
  updateClientReply,
  updateStatusClose,
  deleteTicket,
} = require("../Model/Ticket/TicketModel");
const {
  createNewTicketValidation,
  replyTicketMessageValidation,
} = require("../Middleware/formValidation");
const express = require("express");
const router = express.Router();

router.all("/", (req, res, next) => {
  next();
});

//create a ticket

router.post("/addticket",  createNewTicketValidation, auth, async (req, res) => {
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

router.get("/", auth, async (req, res) => {
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

//update reply message

router.put(
  "/:_id",
  replyTicketMessageValidation,
  auth,
  async (req, res) => {
    try {
      const { message, sender } = req.body;
      const { _id } = req.params;
      const clientId = req.userId;

      const result = await updateClientReply({ _id, message, sender });

      if (result._id) {
        return res.json({
          status: "success",
          message: "your message updated",
        });
      }
      res.json({
        status: "error",
        message: "Unable to update your message please try again later",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  }
);

// update ticket status to close
router.patch("/close-ticket/:_id", auth, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await updateStatusClose({ _id, clientId });

    if (result._id) {
      return res.json({
        status: "success",
        message: "The ticket has been closed",
      });
    }
    res.json({
      status: "error",
      message: "Unable to update the ticket",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// Delete a ticket
router.delete("/:_id", auth, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await deleteTicket({ _id, clientId });

    return res.json({
      status: "success",
      message: "The ticket has been deleted",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

module.exports = router;

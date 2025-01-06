const axios = require("axios");
require("dotenv").config();
const mongoose = require('mongoose');
const ErrorModel = require('../../models/errorModel');

const ZENDESK_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN
const ZENDESK_EMAIL = process.env.ZENDESK_EMAIL
const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN

const auth = Buffer.from(`${ZENDESK_EMAIL}/token:${ZENDESK_API_TOKEN}`).toString("base64");

const RaiseZendeskTicket = async (req, res) => {
  const { id, subject, description, priority } = req.body;

  if (!subject || !description || !id) {
    return res.status(400).json({
      message: 'Bad Request: id, subject, description are required fields'
    })
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ObjectId format for id' });
  }

  const findLoggedError = await ErrorModel.findById(id);

  if (findLoggedError === null) {
    return res.status(400).json({ error: `No error found with id : ${id}` });
  }

  try {
    const response = await axios.post(
      `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json`,
      {
        ticket: {
          subject,
          description,
          priority: priority || "normal", // "urgent", "high", "normal", "low"
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    await ErrorModel.findByIdAndUpdate(id, { status: 'open' });

    return res.status(201).json({
      message: 'Ticket created successfully',
      data: response?.data
    });

  } catch (error) {
    console.error("Error creating Zendesk ticket:", error.response?.data || error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = RaiseZendeskTicket
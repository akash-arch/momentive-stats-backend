const axios = require("axios");
require("dotenv").config();

const ZENDESK_SUBDOMAIN = process.env.ZENDESK_SUBDOMAIN
const ZENDESK_EMAIL = process.env.ZENDESK_EMAIL
const ZENDESK_API_TOKEN = process.env.ZENDESK_API_TOKEN
const ZENDESK_BASE_URL = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json`;

const getZendeskTickets = async (req, res) => {
  try {
    const response = await axios.get(ZENDESK_BASE_URL, {
      auth: {
        username: `${ZENDESK_EMAIL}/token`,
        password: ZENDESK_API_TOKEN,
      },
    });

    return res.status(200).json({
      data: response?.data?.tickets
    });
  } catch (error) {
    console.error("Error fetching tickets:", error.response ? error.response.data : error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = getZendeskTickets
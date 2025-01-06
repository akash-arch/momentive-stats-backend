const express = require("express");
const router = express.Router();

const createError = require('../controllers/Errors/createError');
const getErrorsList = require('../controllers/Errors/getAllErrors');
const raiseZendeskTicket = require('../controllers/Zendesk/RaiseTicket');
const getZendeskTickets = require('../controllers/Zendesk/getAllTickets');
const getLightHouseMetrics = require('../controllers/LightHouse/getLighthouseMetrics')

router.post('/logError', createError);
router.post('/raiseZendeskTicket', raiseZendeskTicket);
router.get('/getZendeskTickets', getZendeskTickets); // active
router.get('/getLoggedErrorsList', getErrorsList); // logged
router.get('/getLighthouseMetrics', getLightHouseMetrics)


module.exports = router;
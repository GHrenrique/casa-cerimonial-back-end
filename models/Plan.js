// models/Plan.js

const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    title: { type: String, required: true },
    services: { type: [String], required: true },
    price: { type: Number, required: true },
    installments: { type: String, required: true },
    pixPrice: { type: String, required: true }
});

const Plan = mongoose.model('Plan', PlanSchema);
module.exports = Plan;

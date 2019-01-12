// equivalent to putting stripe in const then
//  -> stripe(process.env.STRIPE_SECRET)
module.exports = require("stripe")(process.env.STRIPE_SECRET);

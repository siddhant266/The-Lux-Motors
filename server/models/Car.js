const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name:          { type: String, required: true },
    brand:         String,
    category:      String,
    year:          Number,
    description:   String,
    engine:        String,
    top_speed:     String,
    acceleration:  String,
    seats:         Number,
    fuel_type:     String,
    price_display: String,
    price:         Number,          // optional raw numeric price for sorting
    images:        [String],
    is_featured:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);

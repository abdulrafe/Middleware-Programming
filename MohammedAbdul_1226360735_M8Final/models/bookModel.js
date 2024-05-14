const mongoose = require('mongoose');

// Define a Mongoose schema for the Book Exchange model
const bookExchangeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    exchangeType: {
        type: String,
        enum: ['borrow', 'trade'], // Specifies allowed values for exchangeType
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the 'User' model for the owner field
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'], // Specifies allowed values for status
        default: 'available' // Sets a default value if not provided
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1 // Sets a default rating if not provided
    },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps to the documents

// Create a Mongoose model named 'BookExchange' using the defined schema
const BookExchange = mongoose.model('BookExchange', bookExchangeSchema);

// Export the BookExchange model for use in other parts of the application
module.exports = BookExchange;

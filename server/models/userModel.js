const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    goals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    }],
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
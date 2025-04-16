const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deadline: {
        type: Date,
        required: false,
    },
    priority: {
        type: String,
        enum: ['Baixa', 'Média', 'Alta'],
        default: 'Média',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

goalSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
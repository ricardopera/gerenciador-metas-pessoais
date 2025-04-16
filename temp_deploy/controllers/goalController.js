const Goal = require('../models/goalModel');

// Create a new goal
exports.createGoal = async (req, res) => {
    try {
        // Adiciona o userId do usuário autenticado aos dados da meta
        const goalData = {
            ...req.body,
            userId: req.user._id
        };
        
        const goal = new Goal(goalData);
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all goals
exports.getGoals = async (req, res) => {
    try {
        // Filtra metas apenas do usuário autenticado
        const goals = await Goal.find({ userId: req.user._id });
        res.status(200).json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single goal by ID
exports.getGoalById = async (req, res) => {
    try {
        const goal = await Goal.findOne({ 
            _id: req.params.id,
            userId: req.user._id
        });
        
        if (!goal) {
            return res.status(404).json({ message: 'Meta não encontrada' });
        }
        res.status(200).json(goal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a goal by ID
exports.updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        
        if (!goal) {
            return res.status(404).json({ message: 'Meta não encontrada' });
        }
        res.status(200).json(goal);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a goal by ID
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        
        if (!goal) {
            return res.status(404).json({ message: 'Meta não encontrada' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
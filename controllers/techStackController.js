const Module = require("../models/Module");
const TechStack = require("../models/TechStack");

// Create a new TechStack
exports.createTechStack = async(req, res) => {
    try {
        const { name } = req.body;
        const newTechStack = new TechStack({ name });
        await newTechStack.save();
        res.status(201).json(newTechStack);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all TechStacks
exports.getAllTechStacks = async(req, res) => {
    try {
        const techStacks = await TechStack.find().populate('modules');
        res.status(200).json(techStacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get TechStack by ID
exports.getTechStackById = async(req, res) => {
    try {
        const techStack = await TechStack.findById(req.params.id).populate('modules');
        if (!techStack) {
            return res.status(404).json({ message: 'TechStack not found' });
        }
        res.status(200).json(techStack);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a TechStack
exports.updateTechStack = async(req, res) => {
    try {
        const { name } = req.body;
        const updatedTechStack = await TechStack.findByIdAndUpdate(
            req.params.id, { name }, { new: true }
        );
        if (!updatedTechStack) {
            return res.status(404).json({ message: 'TechStack not found' });
        }
        res.status(200).json(updatedTechStack);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a TechStack along with its associated Modules (without populate)
exports.deleteTechStack = async(req, res) => {
    try {
        // Find the TechStack by ID
        const techStack = await TechStack.findById(req.params.id);

        if (!techStack) {
            return res.status(404).json({ message: 'TechStack not found' });
        }

        // Delete all the associated modules using the module IDs stored in the TechStack's 'modules' field
        await Module.deleteMany({ _id: { $in: techStack.modules } });

        // Now delete the TechStack itself
        await TechStack.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'TechStack and its modules deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
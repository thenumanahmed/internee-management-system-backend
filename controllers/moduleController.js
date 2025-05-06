const Module = require("../models/Module");
const TechStack = require("../models/TechStack");

// Create a new Module
exports.createModule = async(req, res) => {
    try {
        const { day, title, description, techStackId } = req.body;
        const newModule = new Module({ day, title, description, techStackId });

        // Ensure the TechStack exists
        const techStack = await TechStack.findById(techStackId);
        if (!techStack) {
            return res.status(400).json({ message: 'TechStack not found' });
        }

        await newModule.save();

        // Add module to the TechStack's modules array
        techStack.modules.push(newModule._id);
        await techStack.save();

        res.status(201).json(newModule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all Modules
exports.getAllModules = async(req, res) => {
    try {
        const modules = await Module.find().populate('techStackId');
        res.status(200).json(modules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Module by ID
exports.getModuleById = async(req, res) => {
    try {
        const module = await Module.findById(req.params.id).populate('techStackId');
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.status(200).json(module);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all Modules by TechStack ID
exports.getModulesByTechStackId = async(req, res) => {
    try {
        const techStackId = req.params.techStackId;
        const modules = await Module.find({ techStackId });

        if (modules.length === 0) {
            return res.status(404).json({ message: 'No modules found for this TechStack' });
        }

        res.status(200).json(modules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a Module
exports.updateModule = async(req, res) => {
    try {
        const { day, title, description } = req.body;
        const updatedModule = await Module.findByIdAndUpdate(
            req.params.id, { day, title, description }, { new: true }
        );
        if (!updatedModule) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.status(200).json(updatedModule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a Module
exports.deleteModule = async(req, res) => {
    try {
        const deletedModule = await Module.findByIdAndDelete(req.params.id);
        if (!deletedModule) {
            return res.status(404).json({ message: 'Module not found' });
        }

        // Remove module from TechStack's modules array
        const techStack = await TechStack.findOne({ modules: req.params.id });
        if (techStack) {
            techStack.modules.pull(req.params.id);
            await techStack.save();
        }

        res.status(200).json({ message: 'Module deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
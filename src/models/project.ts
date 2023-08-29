import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    name: String,
    description: String,
    prompt: String,
    resources: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    }],
    userId: String
});

const Project = mongoose.model('Project', ProjectSchema);
export default Project;
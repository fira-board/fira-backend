import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
    title: String,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project'
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'task'
    }],
    epics: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'resource' 
    }]
});

const Resource = mongoose.model('resource', ResourceSchema);
export default Resource;
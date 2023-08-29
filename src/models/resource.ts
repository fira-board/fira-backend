import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
    title: String,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    epics: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource' 
    }]
});

const Resource = mongoose.model('Resource', ResourceSchema);
export default Resource;
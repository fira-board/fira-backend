import mongoose from 'mongoose';

const EpicSchema = new mongoose.Schema({
    title: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false
    },
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'resource'
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'task'
    }],
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project'
    },
});

const Epic = mongoose.model('epic', EpicSchema);
export default Epic;

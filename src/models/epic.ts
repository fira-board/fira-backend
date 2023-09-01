import mongoose from 'mongoose';

const EpicSchema = new mongoose.Schema({
    title: String,
    status: String,
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
});

const Epic = mongoose.model('Epic', EpicSchema);
export default Epic;

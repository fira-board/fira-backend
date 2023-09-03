import mongoose  from 'mongoose';

const TaskSchema = new mongoose.Schema({
    title: String,
    status: String,
    estimateDaysToFinish: Number,
    epic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Epic'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project'
    },
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;

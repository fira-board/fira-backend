import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    suggestion: String,
    status: String,
    userId: String,
    epic: Object,
    tasks: Array,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
    }
});

const Epic = mongoose.model("feedback", FeedbackSchema);
export default Epic;

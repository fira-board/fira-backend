import mongoose from "mongoose";
import { Document, Types } from "mongoose";
import { IProject } from "./project";

type Ref<T extends Document> = T | Types.ObjectId;

export interface IFeedback extends Document {
    suggestion: string;
    status: "UpVote" | "DownVote";
    userId: string;
    Epic: Object;
    tasks: String[];
    project: Ref<IProject>;
}


const FeedbackSchema = new mongoose.Schema({
    suggestion: String,
    status: {
        type: String,
        enum: ["UpVote", "DownVote"],
        required: true,
    },
    userId: {
        type: String,
        required: true
    },
    epic: Object,
    tasks: Array,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
    }
});

const Epic = mongoose.model("feedback", FeedbackSchema);
export default Epic;

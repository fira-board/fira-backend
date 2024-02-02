import mongoose from "mongoose";
import { Document, Types } from "mongoose";
import { IProject } from "./project";

export const ITEM_CREATE = "Created";
export const ITEM_EDIT = "Edited";
export const ITEM_DELETE = "Deleted";

// The type Ref<T> is either an ObjectId or the full type T
type Ref<T extends Document> = T | Types.ObjectId;

export interface IActivity extends Document {
    type: string;
    userId: string;
    itemId: string;
    item: string;
    projectId: Ref<IProject>;
    date: Date;
}

const ActivitySchema = new mongoose.Schema<IActivity>({
    type: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true,
    },
    itemId: {
        type: String,
    },
    item: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const Activity = mongoose.model<IActivity>("Activity", ActivitySchema);
export default Activity;

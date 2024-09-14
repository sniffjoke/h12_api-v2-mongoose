import {model, Schema} from "mongoose";
import {CommentInstance} from "../interfaces/comments.interface";

const commentatorInfoSchema: Schema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        userLogin: {
            type: String,
            required: true,
        }
    },
    {
        _id: false
    }
)

const likesInfoSchema: Schema = new Schema({
        likesCount: {
            type: Number,
            default: 0
        },
        dislikesCount: {
            type: Number,
            default: 0
        }
    },
    {
        _id: false
    }
)

const commentSchema: Schema = new Schema({
        content: {
            type: String,
            required: true,
        },
        commentatorInfo: {
            type: commentatorInfoSchema,
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post"
        },
        likesInfo: {
            type: likesInfoSchema,
            required: true,
        }

    },
    {
        versionKey: false,
        timestamps: {updatedAt: false},
        toJSON: {
            transform(doc, ret, options) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    },
)

export const commentModel = model<CommentInstance & Document>('Comment', commentSchema);



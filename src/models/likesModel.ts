import {Schema, Document, model} from "mongoose";
import {LikeStatus} from "../interfaces/comments.interface";
import {LikeInstance} from "../interfaces/likes.interface";

const likeStatusSchema: Schema = new Schema({
        status: {
            type: String,
            enum: LikeStatus,
            default: LikeStatus.None,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        commentId: {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        },
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
    }
)

export const likeModel = model<LikeInstance & Document>('Like', likeStatusSchema);

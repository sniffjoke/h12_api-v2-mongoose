import {Schema, Document, model} from "mongoose";
import {PostInstance} from "../interfaces/posts.interface";

const newestLike: Schema = new Schema({
        addedAt: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        login: {
            type: String,
            required: true
        },
    },
    {_id: false}
)

const extendedLikesInfo: Schema = new Schema({
        likesCount: {
            type: Number,
        },
        dislikesCount: {
            type: Number,
        },
        newestLikes: {
            type: [newestLike]
        }
    },
    {_id: false}
)


const postSchema: Schema = new Schema({
        title: {
            type: String,
            required: true,
        },
        shortDescription: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true,
        },
        blogId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Blog"
        },
        blogName: {
            type: String,
            required: true
        },
        extendedLikesInfo: {
            type: extendedLikesInfo,
            required: true
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
    }
)

export const postModel = model<PostInstance & Document>('Post', postSchema);

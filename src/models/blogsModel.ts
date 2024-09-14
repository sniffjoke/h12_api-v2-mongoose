import {Schema, Document, model} from "mongoose";
import {IBlog} from "../types/IBlog";
import {BlogInstance} from "../interfaces/blogs.interface";


const blogSchema: Schema = new Schema({
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
        websiteUrl: {
            type: String,
            required: true,
        },
        isMembership: {
            type: Boolean,
            default: false
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

export const blogModel = model<BlogInstance & Document>('Blog', blogSchema);


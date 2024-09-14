import {Schema, Document, model} from "mongoose";
import {RateLimitInstance} from "../interfaces/rate-limit.interface";

const rateLimitSchema: Schema = new Schema({
        URL: {
            type: String,
            required: true,
        },
        IP: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: false,
        toJSON: {
            transform(doc, ret, options) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
)

export const rateLimitModel = model<RateLimitInstance & Document>('RateLimit', rateLimitSchema);

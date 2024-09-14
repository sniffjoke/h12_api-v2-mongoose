import {Schema, Document, model} from "mongoose";
import {TokenInstance} from "../interfaces/tokens.interface";


const tokenSchema: Schema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        deviceId: {
            // type: Schema.Types.String,
            type: String,
            required: true,
            // ref: "Device",
        },
        refreshToken: {
            type: String,
            required: true
        },
        blackList: {
            type: Boolean,
            required: true,
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
    },
)

export const tokenModel = model<TokenInstance & Document>('Token', tokenSchema);



import {Schema, Document, model} from "mongoose";
import {DeviceInstance} from "../interfaces/devices.interface";

const deviceSchema: Schema = new Schema({
        deviceId: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true,
        },
        lastActiveDate: {
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

export const deviceModel = model<DeviceInstance & Document>('Device', deviceSchema);

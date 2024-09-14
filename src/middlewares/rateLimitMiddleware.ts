import {Request, Response, NextFunction} from "express";
import ip from 'ip'
import {ApiError} from "../exceptions/api.error";
import {IRateLimit} from "../types/IRateLimit";
import {rateLimitModel} from "../models/rateLimitModel";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let overLimitRate: boolean
        const rateLimitData: IRateLimit = {
            URL: req.originalUrl,
            IP: ip.address(),
            date: new Date(Date.now()).toISOString()
        }
        const rateIPEnters = await rateLimitModel.find({IP: rateLimitData.IP, URL: rateLimitData.URL}) //great than Date - return count
        try {
            overLimitRate = ((new Date(rateLimitData.date).getTime()) - (new Date(rateIPEnters[rateIPEnters.length - 5].date).getTime())) / 1000 < 10
        } catch (e) {
            overLimitRate = false
        }
        if (rateIPEnters.length > 4 && overLimitRate) {
            return next(ApiError.RateLimitError());
        }
        const newRate = new rateLimitModel(rateLimitData)
        await newRate.save()
        next()
    } catch (e) {
        return next(ApiError.RateLimitError());
    }
}

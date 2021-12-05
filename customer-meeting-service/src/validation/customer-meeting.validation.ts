import DateExtension from "@joi/date";
import BaseJoi from "joi";
import { Hours } from "../enum/hours";
import { SortTypes } from "../enum/sort-types";
const Joi = BaseJoi.extend(DateExtension);

const paginationOptions = Joi.object().keys({
    
    limit : Joi.number().integer().min(5).less(101).required(),
    skip : Joi.number().integer().min(0).required(),
    order_by : Joi.string().valid("start_time").required(),
    sort_by : Joi.string().valid(...Object.values(SortTypes)).required()
});

const schemas = {
    
    add : Joi.object().keys({

        title : Joi.string().trim().min(2).max(50).required(),
        meeting_day : Joi.date().required(),
        start_time : Joi.string().valid(...Object.values(Hours)).required(),
        end_time : Joi.string().required().when("start_time", { is : Joi.ref("end_time"), then : Joi.disallow(Joi.ref("start_time")), otherwise : Joi.valid(...Object.values(Hours)) }),
        participants : Joi.array().min(1).max(10).items(Joi.string().email().trim().min(5).max(50)).unique().required(),
        customer_id : Joi.number().integer().min(1).required()
    }).options({ abortEarly : false }),

    list : Joi.object({

        title : Joi.string().trim().min(1).max(50).allow(null, "").optional(),
        customerId : Joi.number().integer().min(1).required(),
        paginationOptions : paginationOptions
    }).options({ abortEarly : false }),
};

export default schemas;
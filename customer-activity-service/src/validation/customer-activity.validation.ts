import Joi from "joi";
import { CustomerActivities } from "../enum/customer-activities";

const schemas = {
    
    add : Joi.object().keys({

        customerId : Joi.number().integer().min(1).required(),
        activity : Joi.string().valid(...Object.values(CustomerActivities)).required()
    }).options({ abortEarly : false })
};

export default schemas;
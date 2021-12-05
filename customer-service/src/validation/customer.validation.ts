import Joi from "joi";
import JoiPassword from "joi-password";

const schemas = {
    
    register : Joi.object().keys({

        email : Joi.string().email().trim().min(5).max(50).required(),
        password : JoiPassword.string().min(5).max(15).minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces().required(),
        password_confirmation : JoiPassword.string().required().valid(Joi.ref("password"))
    }).options({ abortEarly : false }),

    login : Joi.object().keys({

        email : Joi.string().email().trim().min(5).max(50).required(),
        password : JoiPassword.string().min(5).max(15).minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces().required()
    }).options({ abortEarly : false })
};

export default schemas;
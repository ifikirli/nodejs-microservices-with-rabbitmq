const ResponseStatusCodes = {
    
    SUCCESSFUL_GENERAL_OPERATION : { code : 1, message : "Operation is successful." },
    SUCCESSFUL_INSERT_OPERATION : { code : 2, message : "Insert operation is successful." },
    SUCCESSFUL_UPDATE_OPERATION : { code : 3, message : "Update operation is successful." },
    SUCCESSFUL_DELETE_OPERATION : { code : 4, message : "Delete operation is successful." },
    SUCCESSFUL_GET_DETAIL_OPERATION : { code : 5, message : "Get detail operation is successful." },
    SUCCESSFUL_LIST_OPERATION : { code : 6, message : "List operation is successful." },
    GENERAL_VALIDATION_ERROR : { code : 7, message : "Validation error." },
    BUSINESS_EXCEPTION : { code : 8, message : "An error was occured." },
    NO_PERMISSION_FOR_OPERATION : { code : 9, message : "You have no permission to process this operation." },
    TOKEN_NOT_FOUND : { code : 10, message : "No token can be found." },
    TOKEN_VERIFICATION_ERROR : { code : 11, message : "An error was occured while verifying user token." },
    INVALID_PARAMETERS : { code : 12, message : "Invalid parameter(s)." },
    DB_EXCEPTION : { code : 13, message : "An error occurred while processing/receiving data. Please contact the system administrator." },
    TOKEN_CREATE_ERROR : { code : 14, message : "An error was occured while creating user token." },
    NO_USER_ID_IN_TOKEN : { code : 15, message : "There is no user id in token." },
    MESSAGE_NOT_FOUND_TO_CONSUME : { code : 16, message : "There is no message to consume." },
    EXIST_EMAIL : { code : 17, message : "Existing customer email cannot be used to register." },
    NO_USER_RECORD : { code : 18, message : "Username or password is incorrect." },
    INVALID_CUSTOMER_ID : { code : 19, message : "Invalid customerId." }
};

export default ResponseStatusCodes;
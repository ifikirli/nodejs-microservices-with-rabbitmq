/* eslint-disable @typescript-eslint/no-explicit-any */
import ResponseStatusCodes from "../response/response-status-codes";
import Hashids from "hashids/cjs";
import config from "../config";
import logger from "../logger/logger";
import moment from "moment";

class CommonUtil {
    
    getSuccessfulResponseCodes (): number[] {

        return [ResponseStatusCodes.SUCCESSFUL_GENERAL_OPERATION.code,
            ResponseStatusCodes.SUCCESSFUL_INSERT_OPERATION.code,
            ResponseStatusCodes.SUCCESSFUL_UPDATE_OPERATION.code,
            ResponseStatusCodes.SUCCESSFUL_DELETE_OPERATION.code,
            ResponseStatusCodes.SUCCESSFUL_GET_DETAIL_OPERATION.code,
            ResponseStatusCodes.SUCCESSFUL_LIST_OPERATION.code];
    }

    encode (data: any): string {

        const hashids = new Hashids(config.SALT_TO_ENCODE, 8);
        const encodedData = hashids.encode(data);
        return encodedData;
    }

    decode (encodedData: string) {

        try {
            const hashids = new Hashids(config.SALT_TO_ENCODE, 8);
            const data = hashids.decode(encodedData);
            if (data && data.length == 1)
                return data[0];
            else
                return undefined;
        } catch (error) {
            logger.error(error);
            return undefined;
        }
    }

    formatDate (date: Date, format: string): string {

        return  moment(date).format(format);
    }
}

const commonUtil = new CommonUtil();
export default commonUtil;
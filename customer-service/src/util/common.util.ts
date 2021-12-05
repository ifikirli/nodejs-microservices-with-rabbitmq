/* eslint-disable @typescript-eslint/no-explicit-any */
import Hashids from "hashids/cjs";
import config from "../config";

class CommonUtil {
    
    encode (data: any): string {

        const hashids = new Hashids(config.SALT_TO_ENCODE, 8);
        const encodedData = hashids.encode(data);
        return encodedData;
    }
}

const commonUtil = new CommonUtil();
export default commonUtil;
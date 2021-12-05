import { Hours } from "../enum/hours";

class CommonUtil {
    
    setHour (date: Date, hour: Hours): Date {

        const _date = new Date();
        _date.setDate(date.getDate());
        const hourEntry = Object.entries(Hours).find(([, value]) => 
            value == hour);
        if (hourEntry) {
            const hourArr = hourEntry["0"].split("_");
            _date.setHours(Number(hourArr[1]), 0, 0, 0);
        }
        return _date;
    }

    addDays (date: Date, days : number): Date {

        date.setDate(date.getDate() + days);
        return date;
    }
}

const commonUtil = new CommonUtil();
export default commonUtil;
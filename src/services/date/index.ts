import dayjs, {Dayjs} from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function isNight(sunset: number){
    const now = dayjs().utc().toDate();
    const sunsetDate = dayjs.unix(sunset).utc().toDate();

    if (now > sunsetDate){
        return true;
    }

    return false;
}
export {dayjs};
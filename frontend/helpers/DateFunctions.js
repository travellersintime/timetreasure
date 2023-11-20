export function isExpired(currDate, dateFromDb) {
    var parsedDateFromDb = Date.parse(dateFromDb);
    var parsedCurrDate = Date.parse(currDate);

    if (parsedCurrDate >= parsedDateFromDb) {
        return true;
    }

    return false;
}

export function convertToDaysHoursMinutesFormat(currDate, dateFromDb) {
    console.log(dateFromDb);
    var parsedDateFromDb = Date.parse(dateFromDb);
    var parsedCurrDate = Date.parse(currDate);

    var diff = parsedDateFromDb - parsedCurrDate;

    const days = Math.floor(diff / (24*60*60*1000));
    const daysms = diff % (24*60*60*1000);
    const hours = Math.floor(daysms / (60*60*1000));
    const hoursms = diff % (60*60*1000);
    const minutes = Math.floor(hoursms / (60*1000));

    return days + "d " + hours + "h " + minutes + "m";
}
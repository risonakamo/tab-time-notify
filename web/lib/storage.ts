// storage related funcs

// the 24hr time hour at which reset will occur
const ResetHour:number=6;

/** storage initial state */
const storageDefault:ExtStorage={
    dailyTime:0,

    // initialise reset time to some time in the future
    resetTime:generateResetTime(ResetHour),
};

/** add to daily time value of storage */
async function addToDailyTime(amount:number):Promise<void>
{
    const storage:ExtStorage=await chrome.storage
        .local.get(storageDefault);

    storage.dailyTime+=amount;

    chrome.storage.local.set(storage);
}

/** get the current daily time */
async function getDailyTime():Promise<number>
{
    const storage:ExtStorage=await chrome.storage
        .local.get(storageDefault);

    return storage.dailyTime;
}

/** trigger reset of daily time. generates a new reset time in the future */
async function resetTime():Promise<void>
{
    const storage:ExtStorage=await chrome.storage
        .local.get(storageDefault);

    storage.dailyTime=0;
    storage.resetTime=generateResetTime(ResetHour);

    chrome.storage.local.set(storage);
}

/** check if should reset the daily time due to being past the reset date. if so,
 *  do the reset. */
async function checkResetTime():Promise<void>
{
    const storage:ExtStorage=await chrome.storage
        .local.get(storageDefault);

    if (new Date().getTime()>=storage.resetTime.getTime())
    {
        return resetTime();
    }
}

/** given 2 dates and a target date, determine if within this time span,
 *  the target date was passed */
function wentPastDate(
    previousDate:Date,
    nowDate:Date,
    targetDate:Date,
):boolean
{
    // to be considered passed, the previous date must be before the target date.
    const prevIsBefore:boolean=previousDate.getTime()<=targetDate.getTime();

    // then, the now date must be after the target date
    const nowisAfter:boolean=nowDate.getTime()>=targetDate.getTime();

    return nowisAfter && prevIsBefore;
}

/** generate the daily reset date at the given time hour. this time hour will always
 *  be in the future */
function generateResetTime(hour:number):Date
{
    const resetDate:Date=new Date();
    resetDate.setHours(hour,0,0,0);

    if (resetDate.getTime()<=Date.now())
    {
        resetDate.setDate(resetDate.getDate()+1);
    }

    return resetDate;
}





export function test_wentPastDate():void
{
    const triggerDate:Date=new Date("2025-03-02T06:00");

    function testDate(date1:Date,date2:Date,result:boolean):void
    {
        if (!(wentPastDate(
            date1,
            date2,
            triggerDate,
        )==result))
        {
            console.error(`failed: ${date1} -> ${date2}`);
            console.log("should have been:",result);
        }
    }

    console.log("test start");
    testDate(new Date("2025-03-02T05:00"), new Date("2025-03-02T12:03"), true);
    testDate(new Date("2025-03-02T21:03"), new Date("2025-03-03T02:03"), false);
    testDate(new Date("2025-03-02T05:00"), new Date("2025-03-03T02:03"), true);
    testDate(new Date("2025-03-02T01:00"), new Date("2025-03-02T05:00"), false);
    testDate(new Date("2025-03-01T23:00"), new Date("2025-03-02T01:00"), false);
    testDate(new Date("2025-03-02T05:00"), new Date("2025-03-02T06:01"), true); // passes trigger by 1 min
    testDate(new Date("2025-03-02T00:00"), new Date("2025-03-02T06:00"), true); // ends exactly at trigger
    testDate(new Date("2025-03-01T22:00"), new Date("2025-03-02T08:00"), true); // long span, passes trigger
    testDate(new Date("2025-03-02T05:59"), new Date("2025-03-02T06:00"), true); // ends exactly at trigger
    testDate(new Date("2025-03-02T06:00"), new Date("2025-03-02T06:01"), true); // starts exactly at trigger
    testDate(new Date("2025-03-02T00:00"), new Date("2025-03-02T05:59"), false); // ends before trigger
    testDate(new Date("2025-03-01T12:00"), new Date("2025-03-01T23:59"), false); // completely before trigger day
    testDate(new Date("2025-03-02T06:01"), new Date("2025-03-02T07:00"), false); // starts after trigger
    testDate(new Date("2025-03-03T00:00"), new Date("2025-03-03T12:00"), false); // completely after trigger day
    testDate(new Date("2025-03-02T06:00"), new Date("2025-03-02T06:00"), true); // exact match, no duration
    console.log("test end");
}
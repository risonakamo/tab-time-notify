// storage related funcs

/** storage initial state */
const storageDefault:ExtStorage={
    lastDailyTimeUpdate:new Date(),
    dailyTime:0,
};

/** the reset time */
const resetTime:Date=generateResetTime(6);

/** add to daily time value of storage. also sets the last
 *  update time */
async function addToDailyTime(amount:number):Promise<void>
{
    const storage:ExtStorage=await chrome.storage
        .local.get(storageDefault);

    dailyResetCheck(storage);

    storage.dailyTime+=amount;
    storage.lastDailyTimeUpdate=new Date();

    chrome.storage.local.set(storage);
}

/** get the current daily time */
async function getDailyTime():Promise<number>
{
    const storage:ExtStorage=await chrome.storage
        .local.get(storageDefault);

    dailyResetCheck(storage);

    return storage.dailyTime;
}

/** checks if the storage time should be reset. returns the possibly
 * modified storage */
function dailyResetCheck(storage:ExtStorage):ExtStorage
{
    if (wentPastDate(storage.lastDailyTimeUpdate,new Date(),resetTime))
    {
        storage.dailyTime=0;
        storage.lastDailyTimeUpdate=new Date();
    }

    return storage;
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
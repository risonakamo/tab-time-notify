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
    const nowisAfter:boolean=nowDate.getTime()>targetDate.getTime();

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

    const date1:Date=new Date("2025-03-02T12:03");
    const date2:Date=new Date("2025-03-02T05:00");
    const date3:Date=new Date("2025-03-02T21:03");
    const date4:Date=new Date("2025-03-03T02:03");

    console.log(wentPastDate(date2,date1,triggerDate));
    console.log(wentPastDate(date3,date4,triggerDate));
    console.log(wentPastDate(date2,date4,triggerDate));
}
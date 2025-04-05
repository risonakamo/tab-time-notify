/** extension storage db definition */
interface ExtStorage
{
    /** last time daily time was updated */
    lastDailyTimeUpdate:Date

    /** accumulated daily time, seconds */
    dailyTime:number
}
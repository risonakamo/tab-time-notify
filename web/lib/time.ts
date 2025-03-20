// time helper funcs

/** convert seconds amount into a duration string */
export function secondsToDuration(seconds:number):string
{
    const mins:number=Math.floor(seconds/60);
    const remainingSeconds:number=Math.floor(seconds%60);
    return `${mins.toString().padStart(2,'0')}:${remainingSeconds.toString().padStart(2,'0')}`;
}

/** computes MM:SS time diff between 2 dates */
export function timeDiff(date1:Date,date2:Date):string
{
    // diff in seconds
    const diff:number=Math.abs(date1.getTime()-date2.getTime())/1000;
    return secondsToDuration(diff);
}
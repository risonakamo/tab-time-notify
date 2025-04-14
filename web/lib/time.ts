// time helper funcs

/** convert seconds amount into a duration string */
export function secondsToDuration(seconds:number):string
{
    const hours:number=Math.floor(seconds/3600);
    const mins:number=Math.floor((seconds%3600)/60);
    const remainingSeconds:number=Math.floor(seconds%60);

    const minsText:string=mins.toString().padStart(2,"0");
    const secText:string=remainingSeconds.toString().padStart(2,"0");

    if (hours>0)
    {
        return `${hours}:${minsText}:${secText}`; // HH:MM:SS
    }

    return `${minsText}:${secText}`; // MM:SS
}

/** computes MM:SS time diff between 2 dates */
export function timeDiff(date1:Date,date2:Date):string
{
    // diff in seconds
    const diff:number=Math.abs(date1.getTime()-date2.getTime())/1000;
    return secondsToDuration(diff);
}
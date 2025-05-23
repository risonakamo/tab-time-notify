<script lang="ts">
import {onMount} from "svelte";
import {setDriftlessInterval,clearDriftless} from "driftless";
import humanizeDuration, {Humanizer} from "humanize-duration";

import {secondsToDuration, timeDiff} from "@/lib/time";
import {addToDailyTime, checkResetTime, getDailyTime, printStorage, resetStorage} from "@/lib/storage";

// --- config
// notification will occur after a random amount of seconds
const minNotificationTime:number=3*60;
const maxNotificationTime:number=4*60;
// const minNotificationTime:number=2;
// const maxNotificationTime:number=3;

const humaniser:Humanizer=humanizeDuration.humanizer({
    units:["h","m"],
    maxDecimalPoints:1,
});

// interval for daily time push
const minDailyTimePushInterval:number=8;
const maxDailyTimePushInterval:number=20;



// --- other const
/** time tab was created */
const createTime:Date=new Date();

/** the main ticker */
var tickerTimer:number|null=null;

/** ticker for dailytime, to be emptied into the storage every so often. in seconds */
var dailyTimeCounter:number=0;

/** when daily time counter reaches this, push into daily time storage */
var dailyTimeCounterPushInterval:number=-1;


// --- state
/** total time tab has been active for */
var totalActiveSeconds:number=$state(0);
/** total active seconds since last notification */
var activeSecondsSinceNotify:number=$state(0);

/** number of seconds when the next notification should be triggered, if above 0 */
var notificationTime:number=$state(-1);

/** if tab is active or not */
var tabActive:boolean=$state(true);

/** total time this since this tab was created (including when it is inactive) */
var totalTabLifeText:string=$state("00:00");

/** if this timer window is showing */
var windowShowing:boolean=$state(false);

/** notification was triggered and is in progress */
var notificationActive:boolean=$state(false);

/** number of active notifications dismissed */
var notificationsDismissed:number=$state(0);

/** if this timer is fully disabled */
var disabled:boolean=$state(false);

var dailyTimeText:string=$state("");


// --- derived
// text versions of various timers
var activeSinceNotifyText:string=$derived(secondsToDuration(activeSecondsSinceNotify));
var totalActiveText:string=$derived(secondsToDuration(totalActiveSeconds));

// - generate a notification time. then, if the document is showing,
//   start the ticker.
// - grab the daily time and set the value. also check for daily reset
onMount(async ()=>{
    generateNotificationTime();

    checkResetTime();
    generateDailyTimePushInterval();
    dailyTimeText=humaniser(await getDailyTime()*1000);

    if (!document.hidden)
    {
        startTimer();
    }

    (window as any).resetStorage=resetStorage;
});


// --- funcs
/** set the next notification time to a new random value */
function generateNotificationTime():void
{
    const randSeconds:number=Math.random()*
        (maxNotificationTime-minNotificationTime)+minNotificationTime;

    notificationTime=Math.floor(randSeconds);
}

/** generate and set new daily time push interval */
function generateDailyTimePushInterval():void
{
    const randSeconds:number=Math.random()*
        (maxDailyTimePushInterval-minDailyTimePushInterval)+minDailyTimePushInterval;

    dailyTimeCounterPushInterval=Math.floor(randSeconds);
}

/** trigger notification. sets window to be showing, and notification is active */
function triggerNotify():void
{
    windowShowing=true;
    notificationActive=true;
}

/** deploy the main interval action timer. clears resets the previous
 *  timer if it was active */
function startTimer():void
{
    console.log("timer starting");

    if (tickerTimer!=null)
    {
        clearDriftless(tickerTimer);
    }

    // timer executing periodic actions.
    // periodic actions include incrementing the active timers. thus,
    // this timer should only execute if the tab is active.
    // this timer is safe to be destroyed anytime, and should be destroyed
    // when the tab is not active. it does not need to tick in an inactive
    // tab.
    tickerTimer=setDriftlessInterval(async ()=>{
        console.log("timer:",activeSecondsSinceNotify,"/",notificationTime);

        // printStorage();

        if (disabled)
        {
            return;
        }

        // extra check to abort timer if defocused
        if (document.hidden)
        {
            onWindowBlur();
            return;
        }

        totalTabLifeText=timeDiff(new Date(),createTime);

        if (tabActive)
        {
            totalActiveSeconds++;
            activeSecondsSinceNotify++;
            dailyTimeCounter++;

            // daily time counter accumulated enough to push. push to storage.
            if (dailyTimeCounterPushInterval>0
                &&dailyTimeCounter>=dailyTimeCounterPushInterval
            )
            {
                // potentially reset the daily time first
                await checkResetTime();
                dailyTimeText=humaniser(await addToDailyTime(dailyTimeCounter)*1000);
                dailyTimeCounter=0;
                generateDailyTimePushInterval();
            }
        }

        // trigger notify once time since last notify above the notify time,
        // but only if notify time is above 0, and a notification is not already active
        if (notificationTime>0
            && !notificationActive
            && activeSecondsSinceNotify>=notificationTime
        )
        {
            triggerNotify();
        }
    },1000);
}

/** stop the ticker */
function stopTimer():void
{
    console.log("timer ending");

    if (tickerTimer!=null)
    {
        clearDriftless(tickerTimer);
        tickerTimer=null;
    }
}


// --- handlers
/** when defocused, set not active. also, disable the timer */
function onWindowBlur():void
{
    tabActive=false;
    stopTimer();
}

/** on focus, set active. reenable the timer. */
function onWindowFocus():void
{
    tabActive=true;
    startTimer();
}

/** clicked dismiss button. hide the window.
 *  if notification was active, also generate a new notification time, and reset
 *  the time since last notification */
function onDismiss():void
{
    if (notificationActive)
    {
        activeSecondsSinceNotify=0;
        generateNotificationTime();
        notificationActive=false;
        notificationsDismissed++;
    }

    windowShowing=false;
}

/** clicked dismiss forever button. dismiss window so that it doesnt come back */
function onDismissForever():void
{
    disabled=true;
    windowShowing=false;
    notificationTime=-1;
    notificationActive=false;
}

/** document visibility changing. trigger window blur or focus. might double
 *  up calling, but this is ok? maybe not. if not, maybe remove the window
 *  focus/blur */
function onDocumentVisChange():void
{
    if (document.hidden)
    {
        onWindowBlur();
    }

    else
    {
        onWindowFocus();
    }
}

/** clicked reset button. dismisses the window, but also resets a bunch of active timer stats */
function onReset():void
{
    totalActiveSeconds=0;
    activeSecondsSinceNotify=0;
    notificationActive=false;
    notificationsDismissed=0;
    windowShowing=false;

    generateNotificationTime();
}
</script>

<style lang="sass">
    @use "./tab-timer.sass"
</style>

<div class="tab-timer">
    <div class="indicator" class:paused={!tabActive}>
        {activeSinceNotifyText}
    </div>

    <div class="timer-window" class:notifying={notificationActive} class:hidden={!windowShowing}>
        <div class="timer-zone">
            <p class="label">Since the last popup...</p>
            <div class="timer">
                {activeSinceNotifyText}
            </div>
        </div>
        <div class="timer-zone">
            <p class="label">Total watchtime...</p>
            <div class="timer">
                {totalActiveText}
            </div>
        </div>
        <div class="timer-zone">
            <p class="label">Watchtime for today...</p>
            <div class="timer smaller">
                {dailyTimeText}
            </div>
        </div>
        <div class="mini-stats">
            <div class="mini-stat">
                <p class="title">Notifications dismissed</p>
                <p class="value">{notificationsDismissed}</p>
            </div>
            <div class="mini-stat">
                <p class="title">Total tab lifetime</p>
                <p class="value">{totalTabLifeText}</p>
            </div>
        </div>

        <div class="button-zone">
            <div class="button-22" onclick={onDismiss}>
                Dismiss
            </div>

            <div class="button-row">
                <div class="button-22 half first" onclick={onReset}>
                    Reset
                </div>

                <div class="button-22 half" onclick={onDismissForever}
                    title="Prevents timer from reappearing"
                >
                    Close
                </div>
            </div>
        </div>
    </div>
</div>

<svelte:window onblur={onWindowBlur} onfocus={onWindowFocus}/>
<svelte:document onvisibilitychange={onDocumentVisChange}/>
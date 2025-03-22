<script lang="ts">
import {onMount} from "svelte";

import {secondsToDuration, timeDiff} from "@/lib/time";

// --- config
// notification will occur after a random amount of seconds
// const minNotificationTime:number=3*60;
// const maxNotificationTime:number=4*60;
const minNotificationTime:number=3;
const maxNotificationTime:number=5;


// --- other const
/** time tab was created */
const createTime:Date=new Date();


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


// --- derived
// text versions of various timers
var activeSinceNotifyText:string=$derived(secondsToDuration(activeSecondsSinceNotify));
var totalActiveText:string=$derived(secondsToDuration(totalActiveSeconds));

// deploy the timer
onMount(()=>{
    generateNotificationTime();

    setInterval(()=>{
        if (disabled)
        {
            return;
        }

        totalTabLifeText=timeDiff(new Date(),createTime);

        if (tabActive)
        {
            totalActiveSeconds++;
            activeSecondsSinceNotify++;
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
});

/** set the next notification time to a new random value */
function generateNotificationTime():void
{
    const randSeconds:number=Math.random()*
        (maxNotificationTime-minNotificationTime)+minNotificationTime;

    notificationTime=Math.floor(randSeconds);
}

/** trigger notification. sets window to be showing, and notification is active */
function triggerNotify():void
{
    windowShowing=true;
    notificationActive=true;
}

/** when defocused, set not active */
function onWindowBlur():void
{
    tabActive=false;
}

/** on focus, set active */
function onWindowFocus():void
{
    tabActive=true;
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
</script>

<style lang="sass">
    @use "./tab-timer.sass"
</style>

<div class="tab-timer" class:notifying={notificationActive} class:hidden={!windowShowing}>
    <div class="timer-zone">
        <p>Time since last notification</p>
        <div class="timer">
            {activeSinceNotifyText}
        </div>
    </div>
    <div class="timer-zone">
        <p>Total tab time</p>
        <div class="timer">
            {totalActiveText}
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
        <p><a href="javascript:void(0)" onclick={onDismiss}>Dismiss</a></p>
        <p><a href="javascript:void(0)" onclick={onDismissForever}>Dismiss forever</a></p>
    </div>
</div>

<svelte:window onblur={onWindowBlur} onfocus={onWindowFocus}/>
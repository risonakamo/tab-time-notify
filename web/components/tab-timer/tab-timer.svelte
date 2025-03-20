<script lang="ts">
import {onMount} from "svelte";

import {secondsToDuration} from "@/lib/time";

// notification will occur after a random amount of minutes (float)
const minNotificationTime:number=3;
const maxNotificationTime:number=4;

/** time tab was created */
var createTime:string=$state(new Date().toISOString());

/** total time tab has been active for */
var totalActiveSeconds:number=$state(0);
/** total active seconds since last notification */
var activeSecondsSinceNotify:number=$state(0);

/** number of seconds when the next notification should be triggered, if above 0 */
var notificationTime:number=$state(-1);

/** if tab is active or not */
var tabActive:boolean=$state(false);

// text versions of various timers
var activeSinceNotifyText:string=$derived(secondsToDuration(activeSecondsSinceNotify));
var totalActiveText:string=$derived(secondsToDuration(totalActiveSeconds));

// deploy the timer
onMount(()=>{
    generateNotificationTime();

    setInterval(()=>{
        if (tabActive)
        {
            totalActiveSeconds++;
            activeSecondsSinceNotify++;
        }
    },1000);
});

/** set the next notification time to a new random value */
function generateNotificationTime():void
{
    const randMinutes:number=Math.random()*
        (maxNotificationTime-minNotificationTime)+minNotificationTime;

    notificationTime=Math.floor(randMinutes*60);
}

/** when defocused, set not active */
function windowBlur():void
{
    tabActive=false;
}

/** on focus, set active */
function windowFocus():void
{
    tabActive=true;
}
</script>

<style lang="sass">
    @use "./tab-timer.sass"
</style>

<div class="tab-timer">
    <div class="timer-zone">
        <p>Active tab time since last notification</p>
        <div class="timer">
            {activeSinceNotifyText}
        </div>
    </div>
    <div class="timer-zone">
        <p>Total active tab time</p>
        <div class="timer">
            {totalActiveText}
        </div>
    </div>
    <div class="mini-stats">
        <div class="mini-stat">
            <p class="title">Notifications dismissed</p>
            <p class="value">3</p>
        </div>
        <div class="mini-stat">
            <p class="title">Total tab lifetime</p>
            <p class="value">10:33</p>
        </div>
    </div>

    <div class="button-zone">
        <p><a href="">Dismiss</a></p>
        <p><a href="">Dismiss forever</a></p>
    </div>
</div>

<svelte:window onblur={windowBlur} onfocus={windowFocus}/>
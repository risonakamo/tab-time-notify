# problem statement
- sometimes, start watching a youtube video for too long when intended to only watch it for a bit
- would like a timer to popup reminding how much time spent watching
- the timer should tick when a tab is active and being viewed, and after totalling some amount of time (such as 3 minutes) popup appears saying:
    - amount of time since last popup
    - total amount of time viewed on this tab
- would like to apply this concept to all youtube videos and twitch streams/videos
    - needs to happen automatically - as otherwise will definitely forget to use it
    - ideally - configurable which urls it applies to. but this might be hard, so for starters, just have it apply to all youtube videos, streams, ect.
- sometimes, watching a video for real, and maybe it does get annoying (but maybe not and it is still a good idea to have this popup)
    - for this case, the popup should have a dismiss button so it no longer appears. or maybe snooze button so it appears less, or maybe buttons to change the popup duration? not really sure until try out

# implementation ideas
- in order to measure time on a tab, needs to be a content script. can't be a popup, because this only exists when it is open
- where should the popup appear?
    - as a literal popup - this might get really annoying as disrupts the page
    - more seamlessly, it could appear on the page (youtube or twitch) as some kind of ui.  but this might not be very manageable and for every different page need a different ui. so popup might be the only option
- related: [tab time tracker](https://chromewebstore.google.com/detail/tab-time-tracker/nmopfbobjebfhkhnlkemgpjkncbenihj)
    - doesn't have a periodic notification
- [document visibility change](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event) maybe useful for detecting if page is active
- window focus/blur also - this probably counts when it is the main tab, but chrome window is focused. this could be good as then music wouldnt be affected
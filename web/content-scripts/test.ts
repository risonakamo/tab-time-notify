import { mount } from "svelte";

import TabTimer from "@/components/tab-timer/tab-timer.svelte";

function main():void
{
    mount(TabTimer,{target:document.body});
}

main();
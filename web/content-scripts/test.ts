import { mount } from "svelte";

import TestThing from "@/components/test-thing/test-thing.svelte";

function main():void
{
    console.log("hello");

    const zone=document.createElement("div");
    console.log(document.body);
    document.body.insertAdjacentElement("beforeend",zone);
    console.log(document.body);

    mount(TestThing,{target:zone});
    console.log("done mount");
}

main();
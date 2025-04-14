# Dev
1. `pnpm i`
2. `pnpm b`
3. In chrome extensions, load this folder
4. `pnpm w`

# Config
## Websites
Edit manifest.json. Add to the content_scripts -> matches

## Notification time
Config section in `tab-timer.svelte`

For testing, might want to set this small so the window appears immediately

## Reset hour
24hr hour of the day when accumulated daily time will reset. Upon trigger by being past this date, a new one will generate.

Set in `storage.ts` -> `ResetHour`
import { runReadingTime } from "./run-reading-time.js";
import { runShikiHighlighting } from "./run-shiki-highlighting.js";

/*
 * Runtime page enhancements entrypoint.
 * Keep non-custom-element behaviors here so `components.js` stays focused on
 * web component registration only.
 */

function runRuntimeEnhancements() {
    runReadingTime();
    runShikiHighlighting();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runRuntimeEnhancements, { once: true });
} else {
    runRuntimeEnhancements();
}

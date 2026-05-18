import { runReadingTime } from "./run-reading-time.js";
import { runShikiHighlighting } from "./run-shiki-highlighting.js";
import { runPostTocIslands } from "./components/post-toc-island.js";
import { runAboutExperienceIslands } from "./components/about-experience-island.js";
import { runRichQuoteEnhancements } from "./components/quote-block-island.js";
import { runRichDownloadCardEnhancements } from "./components/download-card-island.js";

/*
 * Runtime page enhancements entrypoint.
 * Keep global page enhancements here and delegate island-specific mounts to
 * component modules.
 */

function runRuntimeEnhancements() {
    // Component host islands
    runPostTocIslands();
    runAboutExperienceIslands();

    // Page-level runtime enhancements
    runReadingTime();
    runShikiHighlighting();

    // Rich post blocks
    runRichQuoteEnhancements();
    runRichDownloadCardEnhancements();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runRuntimeEnhancements, { once: true });
} else {
    runRuntimeEnhancements();
}

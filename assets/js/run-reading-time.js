/*
 * Runtime: reading-time calculator for blog posts.
 *
 * This replaces the legacy global plugin and keeps all behavior in ES modules.
 * The calculation is intentionally simple and deterministic:
 * - Count words from post prose text
 * - Ignore code/script/style blocks to avoid inflated estimates
 * - Render a compact label in the post metadata row
 */

const READING_TIME_CONFIG = Object.freeze({
    wordsPerMinute: 270,
    postSelector: "#post",
    labelSelector: ".reading-time__label",
    durationSelector: ".reading-time__duration",
    wordCountSelector: ".reading-time__word-count",
    lessThanMinuteLabel: "Less than a minute read",
});

function getPostRoot() {
    return document.querySelector(READING_TIME_CONFIG.postSelector);
}

function getDisplayElements() {
    return {
        label: document.querySelector(READING_TIME_CONFIG.labelSelector),
        duration: document.querySelector(READING_TIME_CONFIG.durationSelector),
        wordCount: document.querySelector(READING_TIME_CONFIG.wordCountSelector),
    };
}

function shouldIgnoreTextNode(textNode) {
    if (!textNode || !textNode.nodeValue || !textNode.nodeValue.trim()) {
        return true;
    }

    const parent = textNode.parentElement;
    if (!parent) {
        return true;
    }

    // Ignore content that should not affect reading-time estimates.
    return !!parent.closest("pre, code, script, style, noscript, svg, math");
}

function extractReadableText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const parts = [];

    while (walker.nextNode()) {
        const textNode = walker.currentNode;
        if (shouldIgnoreTextNode(textNode)) {
            continue;
        }
        parts.push(textNode.nodeValue.trim());
    }

    return parts.join(" ").replace(/\s+/g, " ").trim();
}

function countWords(text) {
    if (!text) {
        return 0;
    }
    return text.split(" ").length;
}

function formatReadingDuration(wordCount) {
    const rawMinutes = wordCount / READING_TIME_CONFIG.wordsPerMinute;
    if (rawMinutes < 1) {
        return READING_TIME_CONFIG.lessThanMinuteLabel;
    }

    const roundedMinutes = Math.ceil(rawMinutes);
    if (roundedMinutes === 1) {
        return "1 min read";
    }

    return roundedMinutes + " mins read";
}

function setText(element, value) {
    if (element) {
        element.textContent = value;
    }
}

export function runReadingTime() {
    const postRoot = getPostRoot();
    const display = getDisplayElements();

    if (!postRoot || !display.duration) {
        return;
    }

    const readableText = extractReadableText(postRoot);
    const wordCount = countWords(readableText);
    const durationText = formatReadingDuration(wordCount);

    // Keep the current compact metadata design: duration shown, no prefix or count.
    setText(display.label, "");
    setText(display.duration, durationText);
    setText(display.wordCount, "");
}
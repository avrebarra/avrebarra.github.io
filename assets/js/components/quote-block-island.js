import { h, render } from "../preact-runtime.js";

const POST_ROOT_SELECTOR = "#post";
const QUOTE_BLOCK_SELECTOR = '[data-rich-block="quote"]';
const MOUNTED_ATTR = "data-rich-mounted";
const ENHANCED_ATTR = "data-rich-enhanced";

function getPostRoot() {
    return document.querySelector(POST_ROOT_SELECTOR);
}

function getQuoteRoots() {
    const postRoot = getPostRoot();
    if (!postRoot) {
        return [];
    }

    return Array.from(postRoot.querySelectorAll(QUOTE_BLOCK_SELECTOR));
}

function getTrimmedAttribute(element, attributeName) {
    if (!element || !attributeName) {
        return "";
    }

    return (element.getAttribute(attributeName) || "").trim();
}

// Quote attribution line shown under the main quote body.
function QuoteAttribution(props) {
    const hasAuthor = !!props.author;
    const hasSource = !!props.source;
    const hasSourceUrl = !!props.sourceUrl;

    if (!hasAuthor && !hasSource && !hasSourceUrl) {
        return null;
    }

    if (hasSourceUrl && hasSource) {
        return h(
            "figcaption",
            { className: "rich-quote__attribution" },
            hasAuthor ? h("span", null, "- " + props.author + " - ") : h("span", null, "- "),
            h(
                "a",
                {
                    className: "rich-quote__source-link",
                    href: props.sourceUrl,
                },
                props.source
            )
        );
    }

    const segments = [];
    if (hasAuthor) {
        segments.push(props.author);
    }
    if (hasSource) {
        segments.push(props.source);
    }
    if (!segments.length && hasSourceUrl) {
        segments.push(props.sourceUrl);
    }

    return h("figcaption", { className: "rich-quote__attribution" }, "- " + segments.join(" - "));
}

// Presentational island for quote blocks.
function QuoteIsland(props) {
    return h(
        "div",
        { className: "rich-quote__island" },
        h("blockquote", { className: "rich-quote__body" }, props.quoteText),
        h(QuoteAttribution, {
            author: props.author,
            source: props.source,
            sourceUrl: props.sourceUrl,
        })
    );
}

export function runRichQuoteEnhancements() {
    // Keep enhancement scoped to the run entrypoint for easier local reasoning.
    function enhanceQuote(root) {
        const existingBody = root.querySelector(".rich-quote__body") || root.querySelector("blockquote");
        const quoteText = getTrimmedAttribute(root, "data-quote") || (existingBody ? existingBody.textContent.trim() : "");

        if (existingBody) {
            existingBody.remove();
        }

        root.classList.add("rich-quote");
        render(
            h(QuoteIsland, {
                quoteText: quoteText,
                author: getTrimmedAttribute(root, "data-author"),
                source: getTrimmedAttribute(root, "data-source"),
                sourceUrl: getTrimmedAttribute(root, "data-source-url"),
            }),
            root
        );
    }

    function runEnhancementOnce(root) {
        if (root.hasAttribute(MOUNTED_ATTR)) {
            return;
        }

        root.setAttribute(MOUNTED_ATTR, "true");

        try {
            enhanceQuote(root);
            root.setAttribute(ENHANCED_ATTR, "true");
        } catch (error) {
            console.warn("[quote-block-island] failed to enhance", error);
        }
    }

    getQuoteRoots().forEach(runEnhancementOnce);
}
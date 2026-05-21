import { h, render } from "../preact-runtime.js";
import { openRichImagePreview } from "./rich-image-preview.js";

const POST_ROOT_SELECTOR = "#post";
const HEADLINE_BLOCK_SELECTOR = '[data-rich-block="headline-image"]';
const MOUNTED_ATTR = "data-rich-mounted";
const ENHANCED_ATTR = "data-rich-enhanced";

function getPostRoot() {
    return document.querySelector(POST_ROOT_SELECTOR);
}

function getHeadlineRoots() {
    const postRoot = getPostRoot();
    if (!postRoot) {
        return [];
    }

    return Array.from(postRoot.querySelectorAll(HEADLINE_BLOCK_SELECTOR));
}

function getTrimmedAttribute(element, attributeName) {
    if (!element || !attributeName) {
        return "";
    }

    return (element.getAttribute(attributeName) || "").trim();
}

function getTrimmedText(element) {
    if (!element) {
        return "";
    }

    return (element.textContent || "").replace(/\s+/g, " ").trim();
}

function readHeadlineModel(root) {
    const imageElement = root.querySelector("img");
    const captionElement = root.querySelector("figcaption");
    const imageAnchor = imageElement ? imageElement.closest("a[href]") : null;

    const imageUrl = getTrimmedAttribute(root, "data-image-url")
        || (imageElement ? getTrimmedAttribute(imageElement, "src") : "");

    if (!imageUrl) {
        return null;
    }

    return {
        imageUrl: imageUrl,
        imageAlt: getTrimmedAttribute(root, "data-image-alt")
            || (imageElement ? getTrimmedAttribute(imageElement, "alt") : ""),
        captionText: getTrimmedAttribute(root, "data-caption") || getTrimmedText(captionElement),
        captionCredit: getTrimmedAttribute(root, "data-credit")
            || (captionElement ? getTrimmedAttribute(captionElement, "data-credit") : ""),
        linkUrl: getTrimmedAttribute(root, "data-link-url")
            || (imageAnchor ? getTrimmedAttribute(imageAnchor, "href") : ""),
    };
}

function removeHeadlineFallbackNodes(root) {
    Array.from(root.children).forEach(function (child) {
        const tagName = child.tagName;
        const isFallbackTag = tagName === "IMG" || tagName === "A" || tagName === "FIGCAPTION";

        if (isFallbackTag) {
            child.remove();
        }
    });
}

function shouldHandlePreviewClick(event) {
    if (!event) {
        return false;
    }

    if (event.defaultPrevented) {
        return false;
    }

    if (event.button !== 0) {
        return false;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return false;
    }

    return true;
}

function HeadlineImageIsland(props) {
    function handlePreviewClick(event) {
        if (!shouldHandlePreviewClick(event)) {
            return;
        }

        event.preventDefault();
        openRichImagePreview({
            imageUrl: props.imageUrl,
            imageAlt: props.imageAlt,
            captionText: props.captionText,
            captionCredit: props.captionCredit,
        });
    }

    const imageNode = h("img", {
        className: "rich-headline-image__media",
        src: props.imageUrl,
        alt: props.imageAlt || "",
        loading: "lazy",
        decoding: "async",
        onClick: handlePreviewClick,
    });

    const media = props.linkUrl
        ? h(
            "a",
            {
                className: "rich-headline-image__media-link",
                href: props.linkUrl,
                onClick: handlePreviewClick,
            },
            imageNode
        )
        : imageNode;

    const hasCaption = !!props.captionText || !!props.captionCredit;

    return h(
        "div",
        { className: "rich-headline-image__island" },
        media,
        hasCaption
            ? h(
                "p",
                {
                    className: "rich-headline-image__caption",
                    "data-credit": props.captionCredit || undefined,
                },
                props.captionText || ""
            )
            : null
    );
}

export function runRichHeadlineImageEnhancements() {
    // Keep enhancement scoped to the run entrypoint for easier local reasoning.
    function enhanceHeadlineImage(root) {
        const model = readHeadlineModel(root);
        if (!model) {
            return;
        }

        removeHeadlineFallbackNodes(root);
        root.classList.add("rich-headline-image");
        render(h(HeadlineImageIsland, model), root);
    }

    function runEnhancementOnce(root) {
        if (root.hasAttribute(MOUNTED_ATTR)) {
            return;
        }

        root.setAttribute(MOUNTED_ATTR, "true");

        try {
            enhanceHeadlineImage(root);
            root.setAttribute(ENHANCED_ATTR, "true");
        } catch (error) {
            console.warn("[headline-image-island] failed to enhance", error);
        }
    }

    getHeadlineRoots().forEach(runEnhancementOnce);
}

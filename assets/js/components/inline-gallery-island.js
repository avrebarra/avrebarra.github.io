import { ChevronLeft as ChevronLeftIconNode, ChevronRight as ChevronRightIconNode } from "https://esm.sh/lucide";
import { h, render, useEffect, useState } from "../preact-runtime.js";
import { openRichImagePreview } from "./rich-image-preview.js";

const POST_ROOT_SELECTOR = "#post";
const GALLERY_BLOCK_SELECTOR = '[data-rich-block="inline-gallery"]';
const MOUNTED_ATTR = "data-rich-mounted";
const ENHANCED_ATTR = "data-rich-enhanced";
const CAROUSEL_ID_ATTR = "data-rich-carousel-id";
const DEFAULT_COLUMN_COUNT = 2;
const MIN_COLUMN_COUNT = 1;
const MAX_COLUMN_COUNT = 4;
const DEFAULT_STRIP_MIN_ITEM_WIDTH = 220;
const DEFAULT_STRIP_GAP = 14;
const SCROLL_EDGE_EPSILON = 2;

function getPostRoot() {
    return document.querySelector(POST_ROOT_SELECTOR);
}

function getGalleryRoots() {
    const postRoot = getPostRoot();
    if (!postRoot) {
        return [];
    }

    return Array.from(postRoot.querySelectorAll(GALLERY_BLOCK_SELECTOR));
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

function toPositiveInteger(rawValue) {
    const parsed = Number.parseInt(rawValue, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }

    return parsed;
}

function clampColumnCount(columnCount) {
    return Math.min(MAX_COLUMN_COUNT, Math.max(MIN_COLUMN_COUNT, columnCount));
}

function getCarouselId(root, index) {
    const existing = getTrimmedAttribute(root, CAROUSEL_ID_ATTR);
    if (existing) {
        return existing;
    }

    const nextId = "rich-inline-gallery-" + String(index + 1);
    root.setAttribute(CAROUSEL_ID_ATTR, nextId);
    return nextId;
}

function scrollCarouselBy(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) {
        return;
    }

    const computedStyles = window.getComputedStyle(carousel);
    const parsedGap = Number.parseFloat(computedStyles.columnGap || computedStyles.gap || "0");
    const gap = Number.isFinite(parsedGap) ? parsedGap : 0;
    const distance = carousel.clientWidth + gap;

    carousel.scrollBy({
        left: distance * direction,
        behavior: "smooth",
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

function getCarouselEdgeState(carousel) {
    if (!carousel) {
        return {
            hasOverflow: false,
            atStart: true,
            atEnd: true,
        };
    }

    const maxScrollLeft = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    const hasOverflow = maxScrollLeft > SCROLL_EDGE_EPSILON;
    const atStart = carousel.scrollLeft <= SCROLL_EDGE_EPSILON;
    const atEnd = !hasOverflow || carousel.scrollLeft >= maxScrollLeft - SCROLL_EDGE_EPSILON;

    return {
        hasOverflow: hasOverflow,
        atStart: atStart,
        atEnd: atEnd,
    };
}

function LucideIcon(props) {
    const iconNode = Array.isArray(props.iconNode) ? props.iconNode : [];

    return h(
        "svg",
        {
            xmlns: "http://www.w3.org/2000/svg",
            width: props.size || 16,
            height: props.size || 16,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": props.strokeWidth || 2,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "aria-hidden": "true",
        },
        ...iconNode.map(function (entry, index) {
            const tagName = entry[0];
            const attributes = entry[1] || {};

            return h(tagName, Object.assign({ key: String(index) }, attributes));
        })
    );
}

function useCarouselEdgeState(carouselId, enabled) {
    const [edgeState, setEdgeState] = useState({
        hasOverflow: false,
        atStart: true,
        atEnd: false,
    });

    useEffect(function () {
        if (!enabled) {
            setEdgeState({
                hasOverflow: false,
                atStart: true,
                atEnd: false,
            });
            return;
        }

        const carousel = document.getElementById(carouselId);
        if (!carousel) {
            setEdgeState({
                hasOverflow: false,
                atStart: true,
                atEnd: false,
            });
            return;
        }

        function updateEdgeState() {
            const next = getCarouselEdgeState(carousel);

            setEdgeState(function (previous) {
                if (
                    previous.hasOverflow === next.hasOverflow
                    && previous.atStart === next.atStart
                    && previous.atEnd === next.atEnd
                ) {
                    return previous;
                }

                return next;
            });
        }

        updateEdgeState();
        carousel.addEventListener("scroll", updateEdgeState, { passive: true });

        let resizeObserver = null;
        if (typeof ResizeObserver === "function") {
            resizeObserver = new ResizeObserver(function () {
                updateEdgeState();
            });
            resizeObserver.observe(carousel);
        }

        return function () {
            carousel.removeEventListener("scroll", updateEdgeState);

            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [carouselId, enabled]);

    return edgeState;
}

function getDirectFigureChildren(root) {
    return Array.from(root.children).filter(function (child) {
        return child.tagName === "FIGURE";
    });
}

function readFigureModel(figure, index) {
    const imageElement = figure.querySelector("img");
    if (!imageElement) {
        return null;
    }

    const captionElement = figure.querySelector("figcaption");
    const imageAnchor = imageElement.closest("a[href]");
    const imageUrl = getTrimmedAttribute(figure, "data-image-url") || getTrimmedAttribute(imageElement, "src");

    if (!imageUrl) {
        return null;
    }

    return {
        id: imageUrl + "::figure::" + String(index),
        imageUrl: imageUrl,
        imageAlt: getTrimmedAttribute(figure, "data-image-alt") || getTrimmedAttribute(imageElement, "alt"),
        captionText: getTrimmedAttribute(figure, "data-caption") || getTrimmedText(captionElement),
        label: getTrimmedAttribute(figure, "data-label") || getTrimmedAttribute(captionElement, "data-label"),
        credit: getTrimmedAttribute(figure, "data-credit") || getTrimmedAttribute(captionElement, "data-credit"),
        linkUrl: getTrimmedAttribute(figure, "data-link-url") || getTrimmedAttribute(imageAnchor, "href"),
    };
}

function readLooseImageModel(imageElement, index) {
    const imageAnchor = imageElement.closest("a[href]");
    const imageUrl = getTrimmedAttribute(imageElement, "src");

    if (!imageUrl) {
        return null;
    }

    return {
        id: imageUrl + "::image::" + String(index),
        imageUrl: imageUrl,
        imageAlt: getTrimmedAttribute(imageElement, "alt"),
        captionText: getTrimmedAttribute(imageElement, "data-caption"),
        label: getTrimmedAttribute(imageElement, "data-label"),
        credit: getTrimmedAttribute(imageElement, "data-credit"),
        linkUrl: getTrimmedAttribute(imageAnchor, "href"),
    };
}

function readGalleryModels(root) {
    const directFigures = getDirectFigureChildren(root);
    if (directFigures.length) {
        return directFigures.map(readFigureModel).filter(Boolean);
    }

    return Array.from(root.querySelectorAll("img")).map(readLooseImageModel).filter(Boolean);
}

function removeInlineGalleryFallbackNodes(root) {
    Array.from(root.children).forEach(function (child) {
        const tagName = child.tagName;
        const isFallbackTag = tagName === "FIGURE" || tagName === "IMG" || tagName === "A" || tagName === "FIGCAPTION";

        if (isFallbackTag) {
            child.remove();
        }
    });
}

function resolveColumnCount(root, itemCount) {
    const explicit = toPositiveInteger(getTrimmedAttribute(root, "data-columns"));
    if (explicit) {
        return clampColumnCount(explicit);
    }

    if (itemCount <= 1) {
        return 1;
    }

    if (itemCount === 3) {
        return 3;
    }

    return DEFAULT_COLUMN_COUNT;
}

function resolveStripVisibleCount(root, itemCount, rootWidth) {
    const explicitVisible = toPositiveInteger(getTrimmedAttribute(root, "data-visible-count"));
    if (explicitVisible) {
        return Math.max(1, Math.min(itemCount, explicitVisible));
    }

    if (itemCount === 1) {
        return 1;
    }

    if (itemCount === 2) {
        return 2;
    }

    const safeWidth = Number.isFinite(rootWidth) ? rootWidth : 0;
    const minItemWidth = toPositiveInteger(getTrimmedAttribute(root, "data-min-item-width")) || DEFAULT_STRIP_MIN_ITEM_WIDTH;
    const gap = toPositiveInteger(getTrimmedAttribute(root, "data-item-gap")) || DEFAULT_STRIP_GAP;
    const explicitMaxVisible = toPositiveInteger(getTrimmedAttribute(root, "data-max-visible"));
    const maxVisible = explicitMaxVisible ? clampColumnCount(explicitMaxVisible) : MAX_COLUMN_COUNT;
    const computed = Math.floor((safeWidth + gap) / (minItemWidth + gap));
    const autoVisibleCount = Math.max(1, computed);

    return Math.max(1, Math.min(itemCount, maxVisible, autoVisibleCount));
}

function resolveLayoutModel(root, itemCount, rootWidth) {
    const requestedLayout = getTrimmedAttribute(root, "data-layout");

    if (requestedLayout === "grid") {
        return {
            useStrip: false,
            visibleCount: resolveColumnCount(root, itemCount),
            showControls: false,
        };
    }

    const shouldUseStrip = requestedLayout === "carousel"
        ? itemCount > 1
        : itemCount >= 3;

    if (!shouldUseStrip) {
        return {
            useStrip: false,
            visibleCount: resolveColumnCount(root, itemCount),
            showControls: false,
        };
    }

    const visibleCount = resolveStripVisibleCount(root, itemCount, rootWidth);

    return {
        useStrip: true,
        visibleCount: visibleCount,
        showControls: itemCount > visibleCount,
    };
}

function GalleryItem(props) {
    const item = props.item;
    const itemClassName = props.itemClassName || "rich-inline-gallery__item";

    function handlePreviewClick(event) {
        if (!shouldHandlePreviewClick(event)) {
            return;
        }

        event.preventDefault();
        openRichImagePreview({
            imageUrl: item.imageUrl,
            imageAlt: item.imageAlt,
            captionText: item.captionText,
            captionCredit: item.credit,
        });
    }

    const imageNode = h("img", {
        className: "rich-inline-gallery__media",
        src: item.imageUrl,
        alt: item.imageAlt || "",
        loading: "lazy",
        decoding: "async",
        onClick: handlePreviewClick,
    });

    const media = item.linkUrl
        ? h(
            "a",
            {
                className: "rich-inline-gallery__media-link",
                href: item.linkUrl,
                onClick: handlePreviewClick,
            },
            imageNode
        )
        : imageNode;

    const hasCaption = !!item.captionText || !!item.label || !!item.credit;

    return h(
        "figure",
        { className: itemClassName, key: item.id },
        media,
        hasCaption
            ? h(
                "p",
                {
                    className: "rich-inline-gallery__caption",
                    "data-label": item.label || undefined,
                    "data-credit": item.credit || undefined,
                },
                item.captionText || ""
            )
            : null
    );
}

function InlineGalleryIsland(props) {
    if (props.useStrip) {
        const edgeState = useCarouselEdgeState(props.carouselId, props.showControls);
        const disablePrev = !edgeState.hasOverflow || edgeState.atStart;
        const disableNext = !edgeState.hasOverflow || edgeState.atEnd;

        return h(
            "div",
            { className: "rich-inline-gallery__island rich-inline-gallery__island--carousel" },
            h(
                "div",
                {
                    id: props.carouselId,
                    className: "rich-inline-gallery__carousel",
                    "aria-label": "Inline image gallery",
                },
                ...props.items.map(function (item) {
                    return h(GalleryItem, {
                        item: item,
                        key: item.id,
                        itemClassName: "rich-inline-gallery__item rich-inline-gallery__item--carousel",
                    });
                })
            ),
            props.showControls
                ? h(
                    "div",
                    { className: "rich-inline-gallery__controls" },
                    h(
                        "button",
                        {
                            type: "button",
                            className: "rich-inline-gallery__nav rich-inline-gallery__nav--prev",
                            "aria-label": "Previous gallery items",
                            disabled: disablePrev,
                            "aria-disabled": disablePrev ? "true" : "false",
                            onClick: function () {
                                scrollCarouselBy(props.carouselId, -1);
                            },
                        },
                        h(LucideIcon, {
                            iconNode: ChevronLeftIconNode,
                            size: 16,
                            strokeWidth: 2.2,
                        })
                    ),
                    h(
                        "button",
                        {
                            type: "button",
                            className: "rich-inline-gallery__nav rich-inline-gallery__nav--next",
                            "aria-label": "Next gallery items",
                            disabled: disableNext,
                            "aria-disabled": disableNext ? "true" : "false",
                            onClick: function () {
                                scrollCarouselBy(props.carouselId, 1);
                            },
                        },
                        h(LucideIcon, {
                            iconNode: ChevronRightIconNode,
                            size: 16,
                            strokeWidth: 2.2,
                        })
                    )
                )
                : null
        );
    }

    return h(
        "div",
        { className: "rich-inline-gallery__island rich-inline-gallery__island--grid" },
        ...props.items.map(function (item) {
            return h(GalleryItem, { item: item, key: item.id });
        })
    );
}

export function runRichInlineGalleryEnhancements() {
    // Keep enhancement scoped to the run entrypoint for easier local reasoning.
    function enhanceInlineGallery(root, index) {
        const items = readGalleryModels(root);
        if (!items.length) {
            return;
        }

        root.classList.add("rich-inline-gallery");

        const carouselId = getCarouselId(root, index);
        let lastRenderSignature = "";

        function renderForCurrentWidth() {
            const currentWidth = root.getBoundingClientRect().width;
            const layout = resolveLayoutModel(root, items.length, currentWidth);
            const renderSignature = [layout.useStrip, layout.visibleCount, layout.showControls].join(":");

            root.style.setProperty("--inline-gallery-columns", String(layout.visibleCount));
            root.style.setProperty("--inline-gallery-visible-count", String(layout.visibleCount));

            if (renderSignature === lastRenderSignature) {
                return;
            }

            lastRenderSignature = renderSignature;
            render(h(InlineGalleryIsland, {
                items: items,
                useStrip: layout.useStrip,
                showControls: layout.showControls,
                carouselId: carouselId,
            }), root);

            removeInlineGalleryFallbackNodes(root);
        }

        renderForCurrentWidth();

        if (typeof ResizeObserver === "function") {
            const observer = new ResizeObserver(function () {
                renderForCurrentWidth();
            });
            observer.observe(root);
        }
    }

    function runEnhancementOnce(root, index) {
        if (root.hasAttribute(MOUNTED_ATTR)) {
            return;
        }

        root.setAttribute(MOUNTED_ATTR, "true");

        try {
            enhanceInlineGallery(root, index);
            root.setAttribute(ENHANCED_ATTR, "true");
        } catch (error) {
            console.warn("[inline-gallery-island] failed to enhance", error);
        }
    }

    getGalleryRoots().forEach(runEnhancementOnce);
}

import { h, render } from "../preact-runtime.js";

const POST_ROOT_SELECTOR = "#post";
const DOWNLOAD_BLOCK_SELECTOR = '[data-rich-block="download"]';
const DOWNLOAD_LINK_SELECTOR = "a[href]";
const MOUNTED_ATTR = "data-rich-mounted";
const ENHANCED_ATTR = "data-rich-enhanced";
const DIALOG_ID_ATTR = "data-rich-dialog-id";
const HAS_DIALOG_SUPPORT = typeof HTMLDialogElement !== "undefined"
    && typeof document.createElement("dialog").showModal === "function";
const DEFAULT_CARD_MIN_WIDTH = 224;
const DEFAULT_CARD_GAP = 10;
const MAX_AUTO_VISIBLE_COUNT = 8;

function getPostRoot() {
    return document.querySelector(POST_ROOT_SELECTOR);
}

function getDownloadRoots() {
    const postRoot = getPostRoot();
    if (!postRoot) {
        return [];
    }

    return Array.from(postRoot.querySelectorAll(DOWNLOAD_BLOCK_SELECTOR));
}

function getTrimmedAttribute(element, attributeName) {
    if (!element || !attributeName) {
        return "";
    }

    return (element.getAttribute(attributeName) || "").trim();
}

function toPositiveInteger(rawValue) {
    const parsed = Number.parseInt(rawValue, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }

    return parsed;
}

function getFileNameFromUrl(fileUrl) {
    if (!fileUrl) {
        return "";
    }

    const segments = fileUrl.split("/");
    return (segments[segments.length - 1] || "").split("?")[0];
}

function getFileType(explicitType, fileName) {
    if (explicitType) {
        return explicitType.toUpperCase();
    }

    const extensionMatch = fileName.match(/\.([A-Za-z0-9]+)$/);
    if (!extensionMatch) {
        return "FILE";
    }

    return extensionMatch[1].toUpperCase();
}

function getIconLabel(fileType) {
    const compact = (fileType || "FILE").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (!compact) {
        return "FILE";
    }

    return compact.slice(0, 4);
}

function readAnchorModel(anchor, index) {
    const fileUrl = (anchor.getAttribute("href") || "").trim();
    if (!fileUrl) {
        return null;
    }

    const linkText = (anchor.textContent || "").replace(/\s+/g, " ").trim();
    const explicitSize = getTrimmedAttribute(anchor, "data-file-size");
    const sizeMatch = linkText.match(/\(([^()]+)\)\s*$/);
    const fileSize = explicitSize || (sizeMatch ? sizeMatch[1].trim() : "");
    const titleFromText = sizeMatch ? linkText.replace(/\s*\([^()]+\)\s*$/, "") : linkText;

    const fileName = getTrimmedAttribute(anchor, "data-file-name")
        || getFileNameFromUrl(fileUrl)
        || titleFromText
        || "attachment";
    const fileType = getFileType(getTrimmedAttribute(anchor, "data-file-type"), fileName);
    const fileTitle = getTrimmedAttribute(anchor, "data-file-title") || titleFromText || fileName;

    return {
        id: fileUrl + "::" + String(index),
        fileUrl: fileUrl,
        fileName: fileName,
        fileType: fileType,
        iconLabel: getIconLabel(fileType),
        fileTitle: fileTitle,
        fileSize: fileSize,
    };
}

function readRootModel(root) {
    const fileUrl = getTrimmedAttribute(root, "data-file-url");
    if (!fileUrl) {
        return null;
    }

    const existingTitle = root.querySelector(".rich-download__title");
    const existingMeta = root.querySelector(".rich-download__meta");

    const fileName = getTrimmedAttribute(root, "data-file-name") || getFileNameFromUrl(fileUrl);
    const fileType = getFileType(getTrimmedAttribute(root, "data-file-type"), fileName);
    const existingMetaText = existingMeta ? existingMeta.textContent.trim() : "";
    const fileSize = getTrimmedAttribute(root, "data-file-size") || existingMetaText;

    return {
        id: fileUrl + "::root",
        fileUrl: fileUrl,
        fileName: fileName,
        fileType: fileType,
        iconLabel: getIconLabel(fileType),
        fileTitle: getTrimmedAttribute(root, "data-file-title")
            || (existingTitle ? existingTitle.textContent.trim() : "")
            || fileName
            || "Attachment",
        fileSize: fileSize,
    };
}

function readDownloadModels(root) {
    const modelsFromLinks = Array.from(root.querySelectorAll(DOWNLOAD_LINK_SELECTOR))
        .map(readAnchorModel)
        .filter(Boolean);

    const rootModel = readRootModel(root);

    if (!modelsFromLinks.length) {
        return rootModel ? [rootModel] : [];
    }

    // Allow root attributes to override single-link fallback metadata for legacy blocks.
    if (modelsFromLinks.length === 1 && rootModel) {
        const only = modelsFromLinks[0];

        return [{
            id: only.id,
            fileUrl: only.fileUrl,
            fileName: rootModel.fileName || only.fileName,
            fileType: rootModel.fileType || only.fileType,
            iconLabel: rootModel.iconLabel || only.iconLabel,
            fileTitle: rootModel.fileTitle || only.fileTitle,
            fileSize: rootModel.fileSize || only.fileSize,
        }];
    }

    return modelsFromLinks;
}

function getDialogId(root, index) {
    const existing = getTrimmedAttribute(root, DIALOG_ID_ATTR);
    if (existing) {
        return existing;
    }

    const nextId = "rich-download-dialog-" + String(index + 1);
    root.setAttribute(DIALOG_ID_ATTR, nextId);
    return nextId;
}

function resolveVisibleCount(root, rootWidth) {
    const explicitLimit = toPositiveInteger(getTrimmedAttribute(root, "data-visible-limit"));
    const safeWidth = Number.isFinite(rootWidth) ? rootWidth : 0;
    const minCardWidth = toPositiveInteger(getTrimmedAttribute(root, "data-card-min-width")) || DEFAULT_CARD_MIN_WIDTH;
    const gap = toPositiveInteger(getTrimmedAttribute(root, "data-card-gap")) || DEFAULT_CARD_GAP;
    const computed = Math.floor((safeWidth + gap) / (minCardWidth + gap));
    const autoVisibleCount = Math.max(1, computed);

    if (explicitLimit && explicitLimit >= 1) {
        return Math.min(explicitLimit, autoVisibleCount);
    }

    return Math.min(MAX_AUTO_VISIBLE_COUNT, autoVisibleCount);
}

function splitVisibleFiles(files, visibleCount) {
    if (!HAS_DIALOG_SUPPORT) {
        return {
            visibleFiles: files,
            hiddenFiles: [],
        };
    }

    const normalizedVisibleCount = Math.max(1, visibleCount);

    if (files.length <= normalizedVisibleCount) {
        return {
            visibleFiles: files,
            hiddenFiles: [],
        };
    }

    if (normalizedVisibleCount === 1) {
        return {
            visibleFiles: [],
            hiddenFiles: files,
        };
    }

    const previewCount = normalizedVisibleCount - 1;

    return {
        visibleFiles: files.slice(0, previewCount),
        hiddenFiles: files.slice(previewCount),
    };
}

function hideDetachedFallbackList(root, files) {
    const next = root.nextElementSibling;
    if (!next || next.tagName !== "UL") {
        return;
    }

    const links = Array.from(next.querySelectorAll("a[href]"));
    if (!links.length) {
        return;
    }

    const knownUrls = new Set(files.map(function (file) {
        return file.fileUrl;
    }));

    const allLinksMatch = links.every(function (link) {
        const href = (link.getAttribute("href") || "").trim();
        return !!href && knownUrls.has(href);
    });

    if (!allLinksMatch) {
        return;
    }

    next.setAttribute("data-rich-download-fallback-hidden", "true");
    next.style.display = "none";
}

function openDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (!dialog || typeof dialog.showModal !== "function") {
        return;
    }

    if (!dialog.open) {
        dialog.showModal();
    }
}

function closeDialogFromButton(event) {
    const dialog = event.currentTarget.closest("dialog");
    if (dialog && typeof dialog.close === "function") {
        dialog.close();
    }
}

function closeDialogOnBackdrop(event) {
    if (event.target === event.currentTarget && typeof event.currentTarget.close === "function") {
        event.currentTarget.close();
    }
}

function DownloadFileCard(props) {
    const model = props.model;

    return h(
        "a",
        {
            className: "rich-download__card",
            href: model.fileUrl,
            download: model.fileName || undefined,
            title: model.fileTitle,
        },
        h(
            "span",
            {
                className: "rich-download__icon",
                "aria-hidden": "true",
            },
            model.iconLabel
        ),
        h(
            "span",
            { className: "rich-download__body" },
            h("span", { className: "rich-download__title" }, model.fileTitle),
            h("span", { className: "rich-download__meta" }, model.fileSize || model.fileType)
        )
    );
}

function DownloadOverflowCard(props) {
    const remainingLabel = props.hiddenCount === 1 ? "1 file" : String(props.hiddenCount) + " files";

    return h(
        "button",
        {
            className: "rich-download__card rich-download__card--more",
            type: "button",
            onClick: function () {
                openDialog(props.dialogId);
            },
            "aria-haspopup": "dialog",
        },
        h(
            "span",
            {
                className: "rich-download__icon rich-download__icon--more",
                "aria-hidden": "true",
            },
            "+"
        ),
        h(
            "span",
            { className: "rich-download__body" },
            h("span", { className: "rich-download__overflow-label" }, "See more"),
            h("span", { className: "rich-download__meta" }, remainingLabel)
        )
    );
}

function DownloadDialogRow(props) {
    const file = props.file;

    return h(
        "li",
        { className: "rich-download__dialog-item", key: file.id },
        h(
            "a",
            {
                className: "rich-download__dialog-link",
                href: file.fileUrl,
                download: file.fileName || undefined,
                title: file.fileTitle,
            },
            h("span", { className: "rich-download__dialog-link-title" }, file.fileTitle),
            h("span", { className: "rich-download__dialog-link-meta" }, file.fileSize || file.fileType)
        )
    );
}

function DownloadListDialog(props) {
    return h(
        "dialog",
        {
            id: props.dialogId,
            className: "rich-download__dialog",
            onClick: closeDialogOnBackdrop,
        },
        h(
            "div",
            { className: "rich-download__dialog-body" },
            h(
                "div",
                { className: "rich-download__dialog-header" },
                h("h3", { className: "rich-download__dialog-title" }, "Download files"),
                h(
                    "button",
                    {
                        type: "button",
                        className: "rich-download__dialog-close",
                        onClick: closeDialogFromButton,
                        "aria-label": "Close download list",
                    },
                    "Done"
                )
            ),
            h(
                "ul",
                { className: "rich-download__dialog-list" },
                ...props.files.map(function (file) {
                    return h(DownloadDialogRow, { file: file, key: file.id });
                })
            )
        )
    );
}

// Presentational island for one rich download block.
function DownloadCardsIsland(props) {
    const split = splitVisibleFiles(props.files, props.visibleCount);
    const slotCount = split.visibleFiles.length + (split.hiddenFiles.length ? 1 : 0);

    return h(
        "div",
        { className: "rich-download__island" },
        h(
            "div",
            {
                className: "rich-download__strip",
                style: {
                    "--download-slot-count": String(Math.max(1, slotCount)),
                },
            },
            ...split.visibleFiles.map(function (file) {
                return h(DownloadFileCard, { model: file, key: file.id });
            }),
            split.hiddenFiles.length
                ? h(DownloadOverflowCard, {
                    hiddenCount: split.hiddenFiles.length,
                    dialogId: props.dialogId,
                })
                : null
        ),
        split.hiddenFiles.length
            ? h(DownloadListDialog, {
                dialogId: props.dialogId,
                files: props.files,
            })
            : null
    );
}

export function runRichDownloadCardEnhancements() {
    // Keep enhancement scoped to the run entrypoint for easier local reasoning.
    function enhanceDownloadCard(root, index) {
        const files = readDownloadModels(root);
        if (!files.length) {
            return;
        }

        const dialogId = getDialogId(root, index);
        let lastVisibleCount = -1;

        // Determine fullness from measured block width and re-render on resize.
        function renderForCurrentWidth() {
            const currentWidth = root.getBoundingClientRect().width;
            const visibleCount = resolveVisibleCount(root, currentWidth);

            if (visibleCount === lastVisibleCount) {
                return;
            }

            lastVisibleCount = visibleCount;
            render(h(DownloadCardsIsland, {
                files: files,
                visibleCount: visibleCount,
                dialogId: dialogId,
            }), root);
        }

        root.classList.add("rich-download");
        hideDetachedFallbackList(root, files);
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
            enhanceDownloadCard(root, index);
            root.setAttribute(ENHANCED_ATTR, "true");
        } catch (error) {
            console.warn("[download-card-island] failed to enhance", error);
        }
    }

    getDownloadRoots().forEach(runEnhancementOnce);
}
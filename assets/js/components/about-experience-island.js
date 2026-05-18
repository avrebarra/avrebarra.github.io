import { h, render, useState } from "../preact-runtime.js";

const ROOT_SELECTOR = "about-me-experience";
const MOUNTED_ATTR = "data-preact-mounted";

let activeSetExpanded;

function extractTemplateSummary(templateElement) {
    if (!templateElement || !templateElement.content) {
        return "";
    }

    const firstParagraph = templateElement.content.querySelector("p");
    if (!firstParagraph || !firstParagraph.textContent) {
        return "";
    }

    const normalized = firstParagraph.textContent.trim().replace(/\s+/g, " ");
    if (normalized.length <= 132) {
        return normalized;
    }

    return normalized.slice(0, 129).trim() + "...";
}

function readEntryModel(root) {
    const templateElement = root.querySelector("template");
    const templateHtml = templateElement ? templateElement.innerHTML : "";
    const fallbackTranscript = extractTemplateSummary(templateElement);
    const transcriptAttribute = (root.getAttribute("transcript") || "").trim();

    return {
        company: root.getAttribute("company") || "",
        role: root.getAttribute("role") || "",
        date: root.getAttribute("date") || "",
        location: root.getAttribute("location") || "",
        postUrl: root.getAttribute("post-url") || "",
        transcript: transcriptAttribute || fallbackTranscript,
        hasContent: !!templateElement,
        contentHtml: templateHtml,
    };
}

function AboutExperienceEntry(props) {
    const model = props.model;
    const hasContent = model.hasContent;
    const [expanded, setExpanded] = useState(false);

    function toggleExpanded() {
        if (!hasContent) {
            return;
        }

        const willExpand = !expanded;
        if (willExpand) {
            if (activeSetExpanded && activeSetExpanded !== setExpanded) {
                activeSetExpanded(false);
            }
            activeSetExpanded = setExpanded;
        } else if (activeSetExpanded === setExpanded) {
            activeSetExpanded = null;
        }

        setExpanded(willExpand);
    }

    return h(
        "div",
        { className: "about-exp-item" },
        h(
            "div",
            {
                className: "about-exp-header" + (hasContent ? " about-exp-header--clickable" : ""),
                "aria-expanded": expanded ? "true" : "false",
                onClick: hasContent ? toggleExpanded : undefined,
            },
            h(
                "span",
                {
                    className: "about-exp-chevron" + (hasContent ? "" : " about-exp-chevron--muted"),
                    "aria-hidden": "true",
                    style: { transform: expanded ? "rotate(90deg)" : "rotate(0deg)" },
                },
                h(
                    "svg",
                    {
                        viewBox: "0 0 20 20",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg",
                    },
                    h("path", {
                        d: "M7 5L13 10L7 15",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                    })
                )
            ),
            h(
                "div",
                { className: "about-exp-title-block" },
                h(
                    "div",
                    { className: "about-exp-title-line" },
                    h("span", { className: "about-exp-company" }, model.company),
                    h("span", { className: "about-exp-role" }, model.role)
                ),
                h("div", { className: "about-exp-meta" }, [model.date, model.location].filter(Boolean).join(" · ")),
                model.transcript
                    ? h(
                        "p",
                        {
                            className: "about-exp-transcript" + (expanded ? " about-exp-transcript--hidden" : ""),
                        },
                        model.transcript
                    )
                    : null
            )
        ),
        hasContent && expanded
            ? h(
                "div",
                { className: "about-exp-content" },
                h("div", {
                    className: "about-exp-content-inner",
                    dangerouslySetInnerHTML: { __html: model.contentHtml },
                }),
                model.postUrl
                    ? h(
                        "a",
                        {
                            href: model.postUrl,
                            className: "inline-block mt-3 text-sm text-gray-500 underline",
                        },
                        "-> read more"
                    )
                    : null
            )
            : null
    );
}

// About experience host tags are rendered as Preact islands.
export function runAboutExperienceIslands() {
    const roots = Array.from(document.querySelectorAll(ROOT_SELECTOR));

    roots.forEach(function (root) {
        if (root.hasAttribute(MOUNTED_ATTR)) {
            return;
        }

        const model = readEntryModel(root);
        root.setAttribute(MOUNTED_ATTR, "about-me-experience");
        render(h(AboutExperienceEntry, { model: model }), root);
    });
}
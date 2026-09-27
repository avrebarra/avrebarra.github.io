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
        skillset: (root.getAttribute("skillset") || "").trim(),
        transcript: transcriptAttribute || fallbackTranscript,
        hasContent: !!templateElement,
        contentHtml: templateHtml,
    };
}

function AboutExperienceEntry(props) {
    const model = props.model;
    const hasContent = model.hasContent && !!model.contentHtml.trim();
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

    function handleSummaryKeyDown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleExpanded();
        }
    }

    // skillset reorders above summary when expanded
    const skillsetNode = model.skillset
        ? h(
              "div",
              {
                  className: "about-exp-skillset",
                  style: { order: expanded ? -1 : 1 },
              },
              model.skillset,
          )
        : null;

    const summaryNode = hasContent
        ? h(
              "div",
              {
                  className: "about-exp-summary about-exp-summary--clickable",
                  role: "button",
                  tabIndex: 0,
                  "aria-expanded": expanded ? "true" : "false",
                  onClick: toggleExpanded,
                  onKeyDown: handleSummaryKeyDown,
              },
              expanded
                  ? h("div", {
                        className: "about-exp-summary-inner",
                        dangerouslySetInnerHTML: { __html: model.contentHtml },
                    })
                  : h(
                        "p",
                        {
                            className: "about-exp-summary-inner",
                            style: { margin: 0 },
                        },
                        model.transcript,
                    ),
          )
        : model.transcript
          ? h(
                "div",
                { className: "about-exp-summary" },
                h(
                    "p",
                    {
                        className: "about-exp-summary-inner",
                        style: { margin: 0 },
                    },
                    model.transcript,
                ),
            )
          : null;

    const companyNode = model.postUrl
        ? h(
              "a",
              {
                  className: "about-exp-company-link",
                  href: model.postUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  onClick: function (e) {
                      e.stopPropagation();
                  },
                  "aria-label": model.company + " external link",
              },
              "↗",
          )
        : null;

    return h(
        "div",
        { className: "about-exp-item" },
        h(
            "div",
            { className: "about-exp-date" },
            h("div", { className: "about-exp-date-range" }, model.date),
            model.location
                ? h("div", { className: "about-exp-location" }, model.location)
                : null,
        ),
        h(
            "div",
            { className: "about-exp-body" },
            h(
                "div",
                {
                    className: "about-exp-header-block",
                    onClick: function (e) {
                        e.stopPropagation();
                    },
                },
                h(
                    "div",
                    { className: "about-exp-company-row" },
                    h(
                        "span",
                        { className: "about-exp-company" },
                        model.company,
                    ),
                    companyNode,
                ),
                model.role
                    ? h("div", { className: "about-exp-role" }, model.role)
                    : null,
            ),
            // flex order handles the toggle reorder: summary order 0, skillset flips -1/1
            h(
                "div",
                {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    },
                },
                skillsetNode,
                summaryNode
                    ? h("div", { style: { order: 0 } }, summaryNode)
                    : null,
            ),
        ),
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

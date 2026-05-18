import { registerComponent } from "./utils.js";

export class AboutMeExperience extends HTMLElement {
    connectedCallback() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", this.render.bind(this), { once: true });
            return;
        }
        this.render();
    }

    render() {
        var company = this.getAttribute("company") || "";
        var role = this.getAttribute("role") || "";
        var date = this.getAttribute("date") || "";
        var location = this.getAttribute("location") || "";
        var postUrl = this.getAttribute("post-url") || "";
        var transcript = (this.getAttribute("transcript") || "").trim();

        // Grab content from child <template> if present
        var tmpl = this.querySelector("template");
        var hasContent = !!tmpl;

        if (!transcript && tmpl && tmpl.content) {
            var firstParagraph = tmpl.content.querySelector("p");
            if (firstParagraph && firstParagraph.textContent) {
                transcript = firstParagraph.textContent.trim().replace(/\s+/g, " ");
                if (transcript.length > 132) {
                    transcript = transcript.slice(0, 129).trim() + "...";
                }
            }
        }

        // Build root wrapper
        var wrapper = document.createElement("div");
        wrapper.className = "about-exp-item";

        // Header row (clickable if has content)
        var header = document.createElement("div");
        header.className = "about-exp-header" + (hasContent ? " about-exp-header--clickable" : "");
        header.setAttribute("aria-expanded", "false");

        var titleBlock = document.createElement("div");
        titleBlock.className = "about-exp-title-block";

        var titleLine = document.createElement("div");
        titleLine.className = "about-exp-title-line";

        var companySpan = document.createElement("span");
        companySpan.className = "about-exp-company";
        companySpan.textContent = company;

        var roleSpan = document.createElement("span");
        roleSpan.className = "about-exp-role";
        roleSpan.textContent = role;

        titleLine.appendChild(companySpan);
        titleLine.appendChild(roleSpan);
        titleBlock.appendChild(titleLine);

        // Footer line: date · location — always visible
        var footer = document.createElement("div");
        footer.className = "about-exp-meta";
        footer.textContent = [date, location].filter(Boolean).join(" · ");

        titleBlock.appendChild(footer);

        var transcriptLine = null;
        if (transcript) {
            transcriptLine = document.createElement("p");
            transcriptLine.className = "about-exp-transcript";
            transcriptLine.textContent = transcript;
            titleBlock.appendChild(transcriptLine);
        }

        // Chevron on the LEFT
        var chevron = document.createElement("span");
        chevron.setAttribute("aria-hidden", "true");
        chevron.className = "about-exp-chevron" + (hasContent ? "" : " about-exp-chevron--muted");
        chevron.innerHTML = '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 5L13 10L7 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        header.appendChild(chevron);
        header.appendChild(titleBlock);

        wrapper.appendChild(header);

        // Expandable content area
        var contentArea = null;
        if (hasContent) {
            contentArea = document.createElement("div");
            contentArea.className = "hidden about-exp-content";

            var innerDiv = document.createElement("div");
            innerDiv.className = "about-exp-content-inner";
            innerDiv.appendChild(document.importNode(tmpl.content, true));

            // Optional "read more" link
            if (postUrl) {
                var readMore = document.createElement("a");
                readMore.href = postUrl;
                readMore.className = "inline-block mt-3 text-sm text-gray-500 underline";
                readMore.textContent = "→ read more";
                innerDiv.appendChild(readMore);
            }

            contentArea.appendChild(innerDiv);
            wrapper.appendChild(contentArea);

            // Toggle on header click
            var self = this;
            header.addEventListener("click", function () {
                var isExpanded = !contentArea.classList.contains("hidden");

                // Collapse all siblings first
                var parent = self.parentElement;
                if (parent) {
                    Array.from(parent.querySelectorAll("about-me-experience")).forEach(function (entry) {
                        if (entry !== self) {
                            entry._collapse();
                        }
                    });
                }

                if (isExpanded) {
                    self._collapse();
                } else {
                    self._expand();
                }
            });
        }

        this.replaceChildren(wrapper);

        // Store references for external collapse control
        this._contentArea = contentArea;
        this._chevron = chevron;
        this._header = header;
        this._transcriptLine = transcriptLine;
    }

    _expand() {
        if (this._contentArea) {
            this._contentArea.classList.remove("hidden");
        }
        if (this._transcriptLine) {
            this._transcriptLine.classList.add("about-exp-transcript--hidden");
        }
        if (this._header) {
            this._header.setAttribute("aria-expanded", "true");
        }
        if (this._chevron) {
            this._chevron.style.transform = "rotate(90deg)";
        }
    }

    _collapse() {
        if (this._contentArea) {
            this._contentArea.classList.add("hidden");
        }
        if (this._transcriptLine) {
            this._transcriptLine.classList.remove("about-exp-transcript--hidden");
        }
        if (this._header) {
            this._header.setAttribute("aria-expanded", "false");
        }
        if (this._chevron) {
            this._chevron.style.transform = "rotate(0deg)";
        }
    }
}

export function register() {
    registerComponent("about-me-experience", AboutMeExperience);
}
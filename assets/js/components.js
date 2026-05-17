/*
 * Register each custom element from this module in one place so new blog
 * components can share a small, predictable registry without extra tooling.
 */

function registerComponent(tagName, elementClass) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, elementClass);
  }
}

class BlogToc extends HTMLElement {
  connectedCallback() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", this.render.bind(this), { once: true });
      return;
    }

    this.render();
  }

  render() {
    var headings = Array.from(document.querySelectorAll("#post h2[id], #post h3[id]"));

    if (!headings.length) {
      this.replaceChildren();
      this.classList.add("hidden");
      return;
    }

    this.classList.remove("hidden");
    var container = document.createElement("div");
    container.className = "mb-6 rounded border border-gray-200 bg-gray-50 px-4 py-3";

    var title = document.createElement("div");
    title.className = "mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500";
    title.textContent = "On this page";

    var list = document.createElement("ol");
    list.className = "list-decimal pl-4";

    headings.forEach(function (heading) {
      var item = document.createElement("li");
      item.className = heading.tagName === "H3" ? "mb-2 ml-4" : "mb-2";

      var link = document.createElement("a");
      link.className = "text-sm text-gray-500 hover:text-gray-800";
      link.href = "#" + heading.id;
      link.textContent = heading.textContent.trim();

      item.appendChild(link);
      list.appendChild(item);
    });

    container.appendChild(title);
    container.appendChild(list);
    this.replaceChildren(container);
  }
}

registerComponent("blog-toc", BlogToc);

class ExperienceEntry extends HTMLElement {
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

    // Grab content from child <template> if present
    var tmpl = this.querySelector("template");
    var hasContent = !!tmpl;

    // Build root wrapper
    var wrapper = document.createElement("div");
    wrapper.className = "pb-2";

    // Header row (clickable if has content)
    var header = document.createElement("div");
    header.className = "flex items-start gap-3 " + (hasContent ? "cursor-pointer" : "cursor-default");

    var titleBlock = document.createElement("div");
    titleBlock.className = "flex-1";

    var titleLine = document.createElement("div");
    titleLine.className = "flex items-baseline gap-1 flex-wrap leading-tight";

    var companySpan = document.createElement("span");
    companySpan.className = "font-bold";
    companySpan.textContent = company;

    var roleSpan = document.createElement("span");
    roleSpan.className = "font-bold text-gray-500";
    roleSpan.textContent = role;

    titleLine.appendChild(companySpan);
    titleLine.appendChild(roleSpan);
    titleBlock.appendChild(titleLine);

    // Footer line: date · location — always visible
    var footer = document.createElement("div");
    footer.className = "text-sm text-gray-500 mt-0.5 font-mono";
    footer.textContent = [date, location].filter(Boolean).join(" · ");

    titleBlock.appendChild(footer);

    // Chevron bullet on the LEFT
    var chevron = null;
    if (hasContent) {
      chevron = document.createElement("span");
      chevron.setAttribute("aria-hidden", "true");
      chevron.className = "text-xs text-gray-400 mt-1 inline-block flex-shrink-0 transition-transform duration-200";
      chevron.textContent = "▶";
    } else {
      var bullet = document.createElement("span");
      bullet.setAttribute("aria-hidden", "true");
      bullet.className = "text-xs text-gray-300 mt-1 inline-block flex-shrink-0";
      bullet.textContent = "▶";
      header.appendChild(bullet);
    }
    if (chevron) header.appendChild(chevron);
    header.appendChild(titleBlock);

    wrapper.appendChild(header);

    // Expandable content area
    var contentArea = null;
    if (hasContent) {
      contentArea = document.createElement("div");
      contentArea.className = "hidden mt-3 experience-expanded-content";

      var innerDiv = document.createElement("div");
      innerDiv.className = "text-gray-600 leading-7 pl-5 ml-1";
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
          Array.from(parent.querySelectorAll("experience-entry")).forEach(function (entry) {
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
  }

  _expand() {
    if (this._contentArea) {
      this._contentArea.classList.remove("hidden");
    }
    if (this._chevron) {
      this._chevron.style.transform = "rotate(90deg)";
    }
  }

  _collapse() {
    if (this._contentArea) {
      this._contentArea.classList.add("hidden");
    }
    if (this._chevron) {
      this._chevron.style.transform = "rotate(0deg)";
    }
  }
}

registerComponent("experience-entry", ExperienceEntry);

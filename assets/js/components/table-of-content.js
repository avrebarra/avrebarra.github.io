import { registerComponent } from "./utils.js";

export class TableOfContent extends HTMLElement {
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

export function register() {
  registerComponent("table-of-content", TableOfContent);
}
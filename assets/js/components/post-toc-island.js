import { h, render } from "../preact-runtime.js";

const ROOT_SELECTOR = "table-of-content, blog-toc";
const MOUNTED_ATTR = "data-preact-mounted";

function collectHeadings() {
  return Array.from(document.querySelectorAll("#post h2[id], #post h3[id]"));
}

function TableOfContentIsland(props) {
  return h(
    "div",
    { className: "mb-6 rounded border border-gray-200 bg-gray-50 px-4 py-3" },
    h("div", { className: "mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500" }, "On this page"),
    h(
      "ol",
      { className: "list-decimal pl-4" },
      props.items.map(function (item) {
        return h(
          "li",
          {
            className: item.level === "H3" ? "mb-1 ml-4" : "mb-1",
            key: item.id,
          },
          h(
            "a",
            {
              className: "text-sm text-gray-500 hover:text-gray-800",
              href: "#" + item.id,
            },
            item.text
          )
        );
      })
    )
  );
}

// Post heading anchors are rendered into TOC host tags as Preact islands.
export function runPostTocIslands() {
  const roots = Array.from(document.querySelectorAll(ROOT_SELECTOR));
  const headings = collectHeadings();

  roots.forEach(function (root) {
    if (root.hasAttribute(MOUNTED_ATTR)) {
      return;
    }

    root.setAttribute(MOUNTED_ATTR, "table-of-content");
    if (!headings.length) {
      root.replaceChildren();
      root.classList.add("hidden");
      return;
    }

    root.classList.remove("hidden");
    render(
      h(TableOfContentIsland, {
        items: headings.map(function (heading) {
          return {
            id: heading.id,
            level: heading.tagName,
            text: heading.textContent.trim(),
          };
        }),
      }),
      root
    );
  });
}
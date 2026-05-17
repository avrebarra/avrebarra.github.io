/*
 * Runtime: Shiki CDN highlighter for post code blocks.
 *
 * Design goals:
 * 1) Run only inside post content (`#post`)
 * 2) Stay fallback-safe (keep server-rendered code if CDN fails)
 * 3) Normalize legacy language labels for better highlight quality
 */

const SHIKI_CONFIG = Object.freeze({
    cdnModuleUrl: "https://esm.sh/shiki@1.22.2",
    theme: "min-light",
    languages: ["go", "javascript", "typescript", "bash", "python", "json", "yaml", "plaintext"],
    aliases: {
        js: "javascript",
        jsx: "javascript",
        ts: "typescript",
        tsx: "typescript",
        py: "python",
        sh: "bash",
        shell: "bash",
        zsh: "bash",
        yml: "yaml",
        text: "plaintext",
        plain: "plaintext",
        golang: "go",
    },
    // Conservative, targeted rules for known legacy mislabels.
    legacyRules: [
        {
            id: "go-signature-from-javascript",
            from: "javascript",
            to: "go",
            pattern: /(^|\n)\s*func\s+[A-Za-z_][A-Za-z0-9_]*\s*\(/m,
        },
        {
            id: "go-package-from-javascript",
            from: "javascript",
            to: "go",
            pattern: /(^|\n)\s*package\s+[A-Za-z_][A-Za-z0-9_]*\s*(\n|$)/m,
        },
        {
            id: "go-import-block-from-javascript",
            from: "javascript",
            to: "go",
            pattern: /(^|\n)\s*import\s*\(\s*\n/m,
        },
    ],
});

function getPostRoot() {
    return document.querySelector("#post");
}

function listCodeBlocks(postRoot) {
    return Array.from(postRoot.querySelectorAll("pre > code")).filter((code) => !code.closest("pre.shiki-block"));
}

function parseLanguageFromClassName(className) {
    const match = className.match(/language-([A-Za-z0-9_+-]+)/);
    return match && match[1] ? match[1].toLowerCase() : null;
}

function detectRawLanguage(codeElement) {
    const candidates = [];

    if (codeElement.className) {
        candidates.push(codeElement.className);
    }

    const rougeWrapper = codeElement.closest(".highlighter-rouge");
    if (rougeWrapper && rougeWrapper.className) {
        candidates.push(rougeWrapper.className);
    }

    const pre = codeElement.closest("pre");
    if (pre && pre.className) {
        candidates.push(pre.className);
    }

    for (const className of candidates) {
        const parsed = parseLanguageFromClassName(className);
        if (parsed) {
            return parsed;
        }
    }

    return "plaintext";
}

function applyLanguageAlias(language) {
    return SHIKI_CONFIG.aliases[language] || language;
}

function applyLegacyLanguageRules(language, codeText) {
    let normalized = language;

    for (const rule of SHIKI_CONFIG.legacyRules) {
        if (rule.from === normalized && rule.pattern.test(codeText)) {
            normalized = rule.to;
            break;
        }
    }

    return normalized;
}

function resolveLanguage(rawLanguage, codeText) {
    const aliased = applyLanguageAlias(rawLanguage);
    const normalized = applyLegacyLanguageRules(aliased, codeText);

    if (!SHIKI_CONFIG.languages.includes(normalized)) {
        return "plaintext";
    }

    return normalized;
}

function buildShikiPreElement(highlightedHtml) {
    const temp = document.createElement("div");
    temp.innerHTML = highlightedHtml.trim();
    return temp.querySelector("pre.shiki");
}

function replaceCodeBlock(codeElement, shikiPre, language) {
    shikiPre.classList.add("shiki-block");
    shikiPre.setAttribute("data-shiki-lang", language);

    const rougeWrapper = codeElement.closest(".highlighter-rouge");
    if (rougeWrapper) {
        rougeWrapper.replaceWith(shikiPre);
        return;
    }

    const pre = codeElement.closest("pre");
    if (pre) {
        pre.replaceWith(shikiPre);
    }
}

async function loadShikiHighlighter() {
    const shiki = await import(SHIKI_CONFIG.cdnModuleUrl);
    return shiki.createHighlighter({
        themes: [SHIKI_CONFIG.theme],
        langs: SHIKI_CONFIG.languages,
    });
}

function highlightCodeToHtml(highlighter, codeText, language) {
    try {
        return highlighter.codeToHtml(codeText, {
            lang: language,
            theme: SHIKI_CONFIG.theme,
        });
    } catch (error) {
        try {
            return highlighter.codeToHtml(codeText, {
                lang: "plaintext",
                theme: SHIKI_CONFIG.theme,
            });
        } catch (fallbackError) {
            return null;
        }
    }
}

async function highlightPostCodeBlocks(codeBlocks) {
    let highlighter;
    try {
        highlighter = await loadShikiHighlighter();
    } catch (error) {
        console.warn("[shiki] failed to load CDN highlighter, using server-rendered fallback", error);
        return;
    }

    try {
        for (const codeBlock of codeBlocks) {
            const codeText = codeBlock.textContent || "";
            const rawLanguage = detectRawLanguage(codeBlock);
            const resolvedLanguage = resolveLanguage(rawLanguage, codeText);
            const highlightedHtml = highlightCodeToHtml(highlighter, codeText, resolvedLanguage);

            if (!highlightedHtml) {
                continue;
            }

            const shikiPre = buildShikiPreElement(highlightedHtml);
            if (!shikiPre) {
                continue;
            }

            replaceCodeBlock(codeBlock, shikiPre, resolvedLanguage);
        }
    } finally {
        if (typeof highlighter.dispose === "function") {
            highlighter.dispose();
        }
    }
}

export async function runShikiHighlighting() {
    const postRoot = getPostRoot();
    if (!postRoot) {
        return;
    }

    const codeBlocks = listCodeBlocks(postRoot);
    if (!codeBlocks.length) {
        return;
    }

    const startedAt = performance.now();
    await highlightPostCodeBlocks(codeBlocks);
    const durationMs = Math.round(performance.now() - startedAt);
    console.info("[shiki] highlighted", codeBlocks.length, "blocks in", durationMs + "ms");
}
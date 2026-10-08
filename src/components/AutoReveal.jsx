import { useEffect } from "react";

/**
 * <AutoReveal />
 *
 * Scans the DOM once on mount, finds every text element that
 * should animate, splits its text into words, and reveals them
 * word-by-word when the element scrolls into view.
 *
 * SKIPS:
 *   - Anything inside <button>, <input>, <textarea>, <svg>, <code>, <pre>
 *   - Elements marked with `data-no-reveal` or class `no-reveal`
 *   - Elements using `.dynamic-text` or containing `.gradient-text`
 *     (those use `-webkit-text-fill-color: transparent` on the parent —
 *      splitting into word spans would make the text invisible)
 *   - Elements with no visible text
 *
 * Handles dynamic content: uses MutationObserver to catch new nodes
 * (e.g. from filter changes, tab switches).
 */
export default function AutoReveal({
  selector = "h1, h2, h3, h4, p, li:not(:has(p))",
  stagger = 45,
  threshold = 0.15,
} = {}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const skipTags = new Set([
      "BUTTON", "INPUT", "TEXTAREA", "SELECT", "OPTION",
      "SVG", "PATH", "CODE", "PRE", "SCRIPT", "STYLE",
      "KBD", "LABEL",
    ]);

    /* ── Guard: anything that must NOT be word-split ── */
    const shouldSkip = (el) => {
      // Already processed
      if (el.dataset.revealDone === "true") return true;

      // Opted out explicitly
      if (el.dataset.noReveal === "true") return true;

      // Inside an interactive / media element
      if (el.closest("button, input, textarea, svg, code, pre, .no-reveal")) return true;

      // Uses the shimmer effect — must stay as one block
      if (el.classList.contains("dynamic-text")) return true;

      // Contains a shimmer/gradient span inside — also must stay whole
      if (el.querySelector(".dynamic-text, .gradient-text")) return true;

      return false;
    };

    /* ── Wrap each word in a span with a stagger index ── */
    const wrapText = (el) => {
      if (shouldSkip(el)) return;

      const text = el.textContent?.trim() ?? "";
      if (!text || text.length < 3) return;

      // Defensive — already wrapped
      if (el.querySelector(":scope > .reveal-text")) return;

      const nodes = Array.from(el.childNodes);
      let wordIndex = 0;

      const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const raw = node.nodeValue;
          if (!raw || !raw.trim()) return;

          const leading = raw.match(/^\s*/)[0];
          const trailing = raw.match(/\s*$/)[0];
          const body = raw.trim();
          if (!body) return;

          const words = body.split(/\s+/);
          const frag = document.createDocumentFragment();

          if (leading) frag.appendChild(document.createTextNode(leading));

          const wrapper = document.createElement("span");
          wrapper.className = "reveal-text";

          words.forEach((word, idx) => {
            const span = document.createElement("span");
            span.className = "reveal-word";
            span.style.setProperty("--i", wordIndex++);
            span.textContent = word;
            wrapper.appendChild(span);

            if (idx < words.length - 1) {
              wrapper.appendChild(document.createTextNode(" "));
            }
          });

          frag.appendChild(wrapper);
          if (trailing) frag.appendChild(document.createTextNode(trailing));
          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (skipTags.has(node.tagName)) return;
          if (node.classList?.contains("reveal-text")) return;
          if (node.classList?.contains("reveal-word")) return;
          if (node.classList?.contains("dynamic-text")) return;
          if (node.classList?.contains("gradient-text")) return;

          Array.from(node.childNodes).forEach(processNode);
        }
      };

      nodes.forEach(processNode);
      el.dataset.revealDone = "true";
    };

    /* ── Observe all matching elements ── */
    const observeAll = () => {
      const els = document.querySelectorAll(selector);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.querySelectorAll(".reveal-text").forEach((t) => {
                t.classList.add("is-revealed");
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold }
      );

      els.forEach((el) => {
        wrapText(el);
        if (el.dataset.revealDone === "true") {
          observer.observe(el);
        }
      });

      return observer;
    };

    const observer = observeAll();

    /* ── Catch DOM changes (filters, tabs, etc.) ── */
    let scheduled = false;
    const mo = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        observer.disconnect();
        observeAll();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, [selector, threshold]);

  return null;
}
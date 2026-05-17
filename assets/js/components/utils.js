/*
 * Shared helper for custom element registration.
 * Guards duplicate definitions when scripts are loaded multiple times.
 */

export function registerComponent(tagName, elementClass) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, elementClass);
  }
}
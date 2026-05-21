export function openRichImagePreview(payload) {
    const imageUrl = (payload && payload.imageUrl ? payload.imageUrl : "").trim();
    if (!imageUrl) {
        return;
    }

    window.open(imageUrl, "_blank", "noopener,noreferrer");
}

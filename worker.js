// minimal Workers entry for static Jekyll — assets are served by Workers Assets binding
// keep this file: existing `folio` Workers service has a fetch handler, so `wrangler deploy`
// without `main` fails "Missing entry-point" on wrangler 4.x
// mirrors ~/Developments/@lareman/bukugenerus/worker.js
export default {
    async fetch(request, env) {
        return env.ASSETS.fetch(request);
    },
};

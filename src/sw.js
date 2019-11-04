// @flow
import SearchEngine from "./searchEngine";
import { finished } from "stream";
import * as localForage from "localforage";

localForage.config({
  name: "janet",
  version: 1.0 // bump this when there are version incompatibilities
});

let se = new SearchEngine();

self.addEventListener("install", event => {
  console.log("hi! Service worker is registered");
});

self.addEventListener("activate", event => {
  console.log("activate event detected");
});

self.addEventListener("fetch", event => {
  console.log("you tried to request for ", event.request);
  let url = new URL(event.request.url);
  console.log(url.pathname);
  if (url.pathname != "/find" && url.pathname != "/suggest") {
    console.log("wha");
    return fetch(event.request.url);
  }
  let query = url.searchParams.get("q");
  console.log(query);

  if (url.pathname == "/suggest") {
    suggest(event, query);
  }
  if (url.pathname == "/find") {
    find(event, query);
  }
});

function suggest(event, query: ?string): void {}
async function find(event, query: ?string): Promise<void> {
  if (query == null) {
    event.respondWithText(
      event,
      "Hello from Janet, your plastic pal who's fun to be with"
    );
    return;
  }

  if (query == "") {
    event.respondWith(Response.redirect(`/`), 302);
  }

  (query: string);

  let url = await se.router.getSearchForQuery(query);
  event.respondWith(Response.redirect(url, 302));

  console.log("redirecting to google");
  event.respondWith(
    Response.redirect(
      `https://google.com/search?q=${encodeURIComponent(query)}`,
      302
    )
  );
}

function respondWithText(event, txt) {
  let resp = new Response(txt, { headers: { "Content-Type": "text/html" } });
  event.respondWith(resp);
}

export default self;

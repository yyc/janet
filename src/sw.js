import SearchPlugin from "./plugins/searchplugin";
import SearchEngine from "./searchEngine";

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
  if (url.pathname != "/find") {
    console.log("wha");
    return fetch(event.request.url);
  }
  let query = url.searchParams.get("q");
  console.log(query);
  if (query == null) {
    event.respondWithText(
      event,
      "Hello from Janet, your plastic pal who's fun to be with"
    );
  }
  console.log("redirecting to google");
  event.respondWith(
    Response.redirect(
      `https://google.com/search?q=${encodeURIComponent(query)}`,
      302
    )
  );
});

function respondWithText(event, txt) {
  let resp = new Response(txt, { headers: { "Content-Type": "text/html" } });
  event.respondWith(resp);
}

// probably still need some way to easily add plugins (so people can write their own custom plugins)

let regex_url = RegExp("s|((.+))|(http[s]://.+$1)");
function search(store, captures) {
  if (typeof store == "string") {
    // If URL is a regex replacement, do the replacement
    // interpolate url if necessary
  }
}

export default self;

import "./style.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js", { scope: "/find" })
    .then(registration => {
      console.log("registration succeeded, scope is " + registration.scope);
      console.log(registration);
    })
    .catch(error => {
      console.error("registration failed with", error);
    });
}

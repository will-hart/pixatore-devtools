var globalBrowser = typeof chrome !== 'undefined' ? chrome : typeof browser !== 'undefined' ? browser : null;

// @todo Import browser polyfill
globalBrowser.devtools.panels.create(
  "Pixatore",
  "/assets/icon_128_detected.png",
  "/app/index.html");

import { AppController } from "./controllers/app-controller.js";

const app = new AppController();

document.addEventListener("DOMContentLoaded", () => {
  app.init();
});

window.app = app;

/**
 * Controller pentru gestionarea temei aplicatiei (dark/light).
 */
export class ThemeController {
  /**
   * Initializeaza ThemeController si seteaza butonul de toggle.
   */
  constructor() {
    /** @type {HTMLElement} */
    this.toggleBtn = document.querySelector("#theme-toggle");
    this.init();
  }

  /**
   * Initializeaza tema pe baza preferintei salvate si seteaza event listener.
   */
  init() {
    const savedTheme = localStorage.getItem("theme") || "light";
    this.applyTheme(savedTheme);
    this.toggleBtn.addEventListener("click", () => this.toggleTheme());
  }

  /**
   * Aplica tema data si actualizeaza localStorage si textul butonului.
   * @param {string} theme - Tema care va fi aplicata ("light" sau "dark").
   */
  applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    this.toggleBtn.textContent = theme === "dark" ? "Dark" : "Light";
  }

  /**
   * Schimba intre tema light si dark.
   */
  toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
  }
}

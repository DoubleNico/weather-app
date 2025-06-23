export class ThemeController {
  constructor() {
    this.toggleBtn = document.querySelector("#theme-toggle");
    this.init();
  }

  init() {
    const savedTheme = localStorage.getItem("theme") || "light";
    this.applyTheme(savedTheme);
    this.toggleBtn.addEventListener("click", () => this.toggleTheme());
  }

  applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    this.toggleBtn.textContent = theme === "dark" ? "Dark" : "Light";
  }

  toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
  }
}

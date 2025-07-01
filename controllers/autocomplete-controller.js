import { cities } from "../data/cities-data.js";

/**
 * Controller pentru autocomplete-ul campului de oras.
 */
export class AutocompleteController {
  /**
   * Creeaza o noua instanta AutocompleteController.
   * @param {HTMLInputElement} inputElement - Inputul pentru oras.
   * @param {HTMLElement} listElement - Elementul pentru lista de sugestii.
   * @param {Function} onSelectCallback - Functie apelata la selectarea unui oras.
   */
  constructor(inputElement, listElement, onSelectCallback) {
    this.input = inputElement;
    this.list = listElement;
    this.onSelect = onSelectCallback;
    this.selectedIndex = -1;
    this.init();
  }

  /**
   * Initializeaza event listeners pentru input si document.
   */
  init() {
    this.input.addEventListener("input", (e) => this.handleInput(e));
    this.input.addEventListener("click", (e) => this.handleClick(e));
    this.input.addEventListener("keydown", (e) => this.handleKeydown(e));
    document.addEventListener("click", (e) => this.handleOutsideClick(e));
  }

  /**
   * Gestioneaza evenimentul de input si afiseaza sugestiile.
   * @param {Event} e - Evenimentul de input.
   */
  handleInput(e) {
    const query = e.target.value;
    const suggestions = this.filterCities(query);
    this.showSuggestions(suggestions);
  }

  /**
   * Gestioneaza click-ul pe input si afiseaza sugestiile.
   * @param {Event} e - Evenimentul de click.
   */
  handleClick(e) {
    const query = e.target.value;
    const suggestions = this.filterCities(query);

    if (!query || query.length < 2) {
      this.showSuggestions(cities.slice(0, 8));
    } else {
      this.showSuggestions(suggestions);
    }
  }

  /**
   * Gestioneaza navigarea cu tastele in lista de sugestii.
   * @param {KeyboardEvent} e - Evenimentul de tastatura.
   */
  handleKeydown(e) {
    const items = this.list.querySelectorAll(".autocomplete-item");

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.navigateList("down");
        break;
      case "ArrowUp":
        e.preventDefault();
        this.navigateList("up");
        break;
      case "Enter":
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
          e.preventDefault();
          this.selectCity(items[this.selectedIndex].textContent);
        }
        break;
      case "Escape":
        this.hideSuggestions();
        break;
    }
  }

  /**
   * Ascunde sugestiile daca se face click in afara inputului.
   * @param {Event} e - Evenimentul de click.
   */
  handleOutsideClick(e) {
    if (!e.target.closest(".input-container")) {
      this.hideSuggestions();
    }
  }

  /**
   * Filtreaza orasele dupa query.
   * @param {string} query - Textul introdus de utilizator.
   * @returns {Array<string>} - Lista de sugestii.
   */
  filterCities(query) {
    if (!query || query.length < 2) return [];
    return cities
      .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }

  /**
   * Afiseaza sugestiile in lista.
   * @param {Array<string>} suggestions - Lista de sugestii.
   */
  showSuggestions(suggestions) {
    this.list.innerHTML = "";

    if (suggestions.length === 0) {
      this.hideSuggestions();
      return;
    }

    suggestions.forEach((city) => {
      const li = document.createElement("li");
      li.className = "autocomplete-item";
      li.textContent = city;
      li.addEventListener("click", () => this.selectCity(city));
      this.list.appendChild(li);
    });

    this.list.classList.remove("hidden");
    this.selectedIndex = -1;
  }

  /**
   * Ascunde lista de sugestii.
   */
  hideSuggestions() {
    this.list.classList.add("hidden");
    this.selectedIndex = -1;
  }

  /**
   * Selecteaza un oras din lista si apeleaza callback-ul.
   * @param {string} city - Orasul selectat.
   */
  selectCity(city) {
    this.input.value = city;
    this.hideSuggestions();
    if (this.onSelect) {
      this.onSelect(city);
    }
  }

  /**
   * Navigheaza in lista de sugestii cu tastele sus/jos.
   * @param {string} direction - "up" sau "down".
   */
  navigateList(direction) {
    const items = this.list.querySelectorAll(".autocomplete-item");
    if (items.length === 0) return;

    if (this.selectedIndex >= 0 && this.selectedIndex < items.length) {
      items[this.selectedIndex].classList.remove("highlighted");
    }

    if (direction === "down") {
      this.selectedIndex =
        this.selectedIndex < items.length - 1 ? this.selectedIndex + 1 : 0;
    } else if (direction === "up") {
      this.selectedIndex =
        this.selectedIndex > 0 ? this.selectedIndex - 1 : items.length - 1;
    }

    if (this.selectedIndex >= 0 && this.selectedIndex < items.length) {
      items[this.selectedIndex].classList.add("highlighted");
      this.input.value = items[this.selectedIndex].textContent;
    }
  }

  /**
   * Curata inputul si ascunde sugestiile.
   */
  clear() {
    this.input.value = "";
    this.hideSuggestions();
  }
}

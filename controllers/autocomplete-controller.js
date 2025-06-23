import { cities } from "../data/cities-data.js";

export class AutocompleteController {
  constructor(inputElement, listElement, onSelectCallback) {
    this.input = inputElement;
    this.list = listElement;
    this.onSelect = onSelectCallback;
    this.selectedIndex = -1;
    this.init();
  }

  init() {
    this.input.addEventListener("input", (e) => this.handleInput(e));
    this.input.addEventListener("click", (e) => this.handleClick(e));
    this.input.addEventListener("keydown", (e) => this.handleKeydown(e));

    document.addEventListener("click", (e) => this.handleOutsideClick(e));
  }

  handleInput(e) {
    const query = e.target.value;
    const suggestions = this.filterCities(query);
    this.showSuggestions(suggestions);
  }

  handleClick(e) {
    const query = e.target.value;
    const suggestions = this.filterCities(query);

    if (!query || query.length < 2) {
      this.showSuggestions(cities.slice(0, 8));
    } else {
      this.showSuggestions(suggestions);
    }
  }

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

  handleOutsideClick(e) {
    if (!e.target.closest(".input-container")) {
      this.hideSuggestions();
    }
  }

  filterCities(query) {
    if (!query || query.length < 2) return [];
    return cities
      .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }

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

  hideSuggestions() {
    this.list.classList.add("hidden");
    this.selectedIndex = -1;
  }

  selectCity(city) {
    this.input.value = city;
    this.hideSuggestions();
    if (this.onSelect) {
      this.onSelect(city);
    }
  }

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

  clear() {
    this.input.value = "";
    this.hideSuggestions();
  }
}

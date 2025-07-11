# 🌤️ Weather App - Modern JavaScript Weather Application

> O aplicatie meteo completa, rapida si moderna, construita cu JavaScript modular, ce integreaza API-uri reale si UX prietenos.

[Demo Live](https://DoubleNico.github.io/weather-app) | [Cod Sursa](https://github.com/DoubleNico/weather-app.git)

---

## 🎯 Despre Proiect

Weather App este o aplicatie web care iti arata vremea curenta pentru orice oras din lume, cu detalii meteo, localizare automata si istoric de cautari. Proiectul demonstreaza arhitectura modulara, persistenta locala si interfata moderna, fiind ideal pentru oricine vrea sa invete JavaScript avansat fara framework-uri.

Aplicatia pune accent pe experienta utilizatorului: autocomplete pentru orase, tema dark/light, salvarea preferintelor si un istoric vizual al cautarilor recente. Totul este construit cu best practices moderne si fara dependente externe.

---

## ✨ Functionalitati

### Core Features

- **Cautare meteo dupa oras** (autocomplete rapid)
- **Detectare automata a locatiei** (GPS & fallback IP)
- **Afisare detalii meteo**: temperatura, descriere, umiditate, presiune, vant, vizibilitate, rasarit/apus
- **Tema dark/light** cu salvare preferinte
- **Selectare unitati** (Celsius/Fahrenheit) si limba (romana/engleza)
- **Istoric de cautari** persistent, cu stergere rapida si click pentru reincarcare

### Advanced Features

- **Persistenta cu localStorage** pentru istoric si preferinte
- **Serviciu de logging** cu niveluri (debug/info/warn/error) si interfata globala `window.logs`
- **UX modern**: efecte hover, responsive, animatii subtile
- **Gestionare erori** centralizata si mesaje prietenoase

### Technical Highlights

- **Arhitectura modulara** (controllers, modules, data)
- **Separatie clara intre logica, UI si servicii**
- **Best practices**: async/await, destructurare, validare input, fallback-uri robuste
- **Usor de extins** pentru functionalitati noi

### Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

---

## 🗺️ Roadmap Viitor

- [ ]  PWA Support
- [ ]  Extended forecast (5 days)
- [ ]  Weather maps integration
- [ ]  Multiple locations tracking
- [ ]  Make API KEYS environment variables 

## 🛠️ Tehnologii Utilizate

### Frontend

- **Vanilla JavaScript (ES6+)** – module, class-based controllers
- **CSS3** – design responsive, variabile CSS, efecte moderne
- **HTML5** – semantic, accesibil

### APIs & Services

- **OpenWeatherMap API** – date meteo live
- **Geolocation API** – localizare automata
- **IP Geolocation API** – fallback pentru locatie

### Tools & Workflow

- **Git/GitHub** – versionare si colaborare
- **VS Code** – dezvoltare rapida
- **GitHub Pages** – demo live

---

## 🚀 Demo si Screenshots

<p align="center">
  <img src="screenshots/1.png" alt="Weather App Screenshot 1" width="400"/>
  <img src="screenshots/2.png" alt="Weather App Screenshot 2" width="400"/>
  <img src="screenshots/3.png" alt="Weather App Screenshot 3" width="400"/>
</p>
---

## 📦 Instalare si Rulare

### Cerinte

- Browser modern (Chrome, Firefox, Safari, Edge)
- API key gratuit de la OpenWeatherMap

### Setup Local

```bash
# Clone repository
git clone https://github.com/DoubleNico/weather-app.git
cd weather-app

# Configurare API key
# Editeaza modules/config.js si adauga API key-ul tau la `CONFIG.API_KEY`
```

Deschide `index.html` in browser sau foloseste Live Server pentru o experienta completa.

---

## 🧑‍💻 Contribuie

Pull requests si feedback-ul sunt binevenite! Deschide un issue pentru bug-uri sau idei noi.

---

## 📄
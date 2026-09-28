const initiatives = [
  {
    name: "Ponto de Reuso Vila Madalena",
    category: "reuso",
    categoryLabel: "Reuso e doação",
    icon: "bi-box2-heart",
    neighborhood: "Vila Madalena",
    address: "Rua Harmonia, 210 · São Paulo, SP",
    email: "contato@exemplo.org",
    phone: "(11) 4000-1201",
    description: "Coleta e redistribuição de roupas, livros e objetos em bom estado.",
    coordinates: [-23.5538, -46.6917]
  },
  {
    name: "Cozinha Circular Pinheiros",
    category: "alimento",
    categoryLabel: "Alimentação",
    icon: "bi-basket2-heart",
    neighborhood: "Pinheiros",
    address: "Rua dos Pinheiros, 480 · São Paulo, SP",
    email: "cozinha@exemplo.org",
    phone: "(11) 4000-1202",
    description: "Aproveitamento integral de alimentos e refeições comunitárias.",
    coordinates: [-23.5662, -46.7003]
  },
  {
    name: "Coletivo Circular Paulista",
    category: "reciclagem",
    categoryLabel: "Reciclagem",
    icon: "bi-recycle",
    neighborhood: "Bela Vista",
    address: "Rua Treze de Maio, 95 · São Paulo, SP",
    email: "circular@exemplo.org",
    phone: "(11) 4000-1203",
    description: "Orientação sobre separação de resíduos e coleta seletiva local.",
    coordinates: [-23.5595, -46.6478]
  },
  {
    name: "Oficina Recomeço Centro",
    category: "educacao",
    categoryLabel: "Educação ambiental",
    icon: "bi-tools",
    neighborhood: "República",
    address: "Rua Aurora, 320 · São Paulo, SP",
    email: "oficina@exemplo.org",
    phone: "(11) 4000-1204",
    description: "Oficinas comunitárias de reparo, reaproveitamento e educação ambiental.",
    coordinates: [-23.5424, -46.6442]
  }
];

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

function createCard(initiative, compact = false) {
  const safeName = escapeHtml(initiative.name);
  const safeNeighborhood = escapeHtml(initiative.neighborhood);
  const safeDescription = escapeHtml(initiative.description);
  const contact = compact
    ? `<span><i class="bi bi-geo-alt"></i> ${safeNeighborhood}</span>`
    : `<p class="org-description">${safeDescription}</p><div class="org-contact"><a href="mailto:${initiative.email}"><i class="bi bi-envelope"></i> ${initiative.email}</a><a href="tel:${initiative.phone.replace(/[^\d+]/g, "")}"><i class="bi bi-telephone"></i> ${initiative.phone}</a></div>`;

  return `<article class="org-card${compact ? " compact-card" : ""}" data-org="${initiative.name}">
    <span class="org-icon"><i class="bi ${initiative.icon}"></i></span>
    <div class="org-card-content"><span class="org-category">${initiative.categoryLabel}</span><h3>${safeName}</h3><div class="org-location"><i class="bi bi-geo-alt"></i> ${safeNeighborhood}</div>${contact}</div>
    ${compact ? "<i class=\"bi bi-arrow-up-right card-arrow\"></i>" : ""}
  </article>`;
}

function createMap(element, options = {}) {
  if (!element || !window.L) return null;

  const map = L.map(element, { scrollWheelZoom: false }).setView([-23.5587, -46.6691], options.zoom || 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const markers = new Map();
  initiatives.forEach((initiative) => {
    const marker = L.marker(initiative.coordinates, { icon: L.divIcon({
      className: "custom-marker",
      html: `<span><i class="bi ${initiative.icon}"></i></span>`,
      iconSize: [38, 38],
      iconAnchor: [19, 36]
    }) }).addTo(map);
    marker.bindPopup(`<div class="map-popup"><strong>${escapeHtml(initiative.name)}</strong><span>${escapeHtml(initiative.neighborhood)} · ${initiative.categoryLabel}</span><a href="mailto:${initiative.email}">${initiative.email}</a></div>`);
    markers.set(initiative.name, marker);
  });

  return { map, markers };
}

const homeMap = createMap(document.querySelector("#homeMap"), { zoom: 12 });
if (homeMap) {
  const homeList = document.querySelector("#homeOrgList");
  homeList.innerHTML = initiatives.slice(0, 3).map((item) => createCard(item, true)).join("");
  homeList.querySelectorAll(".org-card").forEach((card) => {
    card.addEventListener("click", () => {
      const item = initiatives.find((initiative) => initiative.name === card.dataset.org);
      homeMap.map.flyTo(item.coordinates, 15, { duration: 0.6 });
      homeMap.markers.get(item.name).openPopup();
    });
  });
  window.setTimeout(() => homeMap.map.invalidateSize(), 100);
}

const directoryMap = createMap(document.querySelector("#directoryMap"), { zoom: 12 });
if (directoryMap) {
  const list = document.querySelector("#orgList");
  const search = document.querySelector("#orgSearch");
  const filter = document.querySelector("#categoryFilter");
  const count = document.querySelector("#resultsCount");

  function renderInitiatives() {
    const term = search.value.trim().toLocaleLowerCase("pt-BR");
    const category = filter.value;
    const results = initiatives.filter((initiative) => {
      const matchesSearch = `${initiative.name} ${initiative.neighborhood} ${initiative.categoryLabel}`.toLocaleLowerCase("pt-BR").includes(term);
      return matchesSearch && (category === "all" || initiative.category === category);
    });

    list.innerHTML = results.length
      ? results.map((item) => createCard(item)).join("")
      : '<div class="empty-state"><i class="bi bi-search"></i><p>Nenhuma iniciativa encontrada.</p><span>Tente outro nome, bairro ou causa.</span></div>';
    count.textContent = `${results.length} ${results.length === 1 ? "iniciativa encontrada" : "iniciativas encontradas"}`;
    initiatives.forEach((item) => {
      const marker = directoryMap.markers.get(item.name);
      if (results.includes(item)) marker.addTo(directoryMap.map);
      else directoryMap.map.removeLayer(marker);
    });

    list.querySelectorAll(".org-card").forEach((card) => {
      card.addEventListener("click", () => {
        const item = initiatives.find((initiative) => initiative.name === card.dataset.org);
        directoryMap.map.flyTo(item.coordinates, 15, { duration: 0.6 });
        directoryMap.markers.get(item.name).openPopup();
      });
    });
  }

  search.addEventListener("input", renderInitiatives);
  filter.addEventListener("change", renderInitiatives);
  document.querySelector("#locateButton").addEventListener("click", () => {
    if (!navigator.geolocation) {
      count.textContent = "Seu navegador não oferece localização. Veja as iniciativas demonstrativas no mapa.";
      return;
    }
    count.textContent = "Solicitando sua localização...";
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => directoryMap.map.flyTo([coords.latitude, coords.longitude], 13, { duration: 0.8 }),
      () => { count.textContent = "Não foi possível acessar sua localização. Verifique a permissão do navegador."; },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  renderInitiatives();
  window.setTimeout(() => directoryMap.map.invalidateSize(), 100);
}

const signupForm = document.querySelector("#signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    signupForm.classList.add("was-validated");
    if (!signupForm.checkValidity()) {
      signupForm.querySelector(":invalid")?.focus();
      return;
    }
    document.querySelector("#formSuccess").classList.remove("d-none");
    signupForm.reset();
    signupForm.classList.remove("was-validated");
  });
}
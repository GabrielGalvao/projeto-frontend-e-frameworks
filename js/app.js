const initiatives = [
  ["Ponto de Reuso Vila Madalena", "Vila Madalena", "contato@exemplo.org", [-23.5538, -46.6917]],
  ["Cozinha Circular Pinheiros", "Pinheiros", "cozinha@exemplo.org", [-23.5662, -46.7003]],
  ["Coletivo Circular Paulista", "Bela Vista", "circular@exemplo.org", [-23.5595, -46.6478]],
  ["Oficina Recomeço Centro", "República", "oficina@exemplo.org", [-23.5424, -46.6442]]
];

document.querySelectorAll(".initiative-map").forEach((element) => {
  const map = L.map(element).setView([-23.5587, -46.6691], 12);

  L.tileLayer("https://tile.openstreetmap.de/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  initiatives.forEach(([name, neighborhood, email, coordinates]) => {
    L.marker(coordinates).addTo(map).bindPopup(
      `<strong>${name}</strong><br>${neighborhood}<br><a href="mailto:${email}">${email}</a>`
    );
  });
});

const signupForm = document.querySelector("#signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#formSuccess").classList.remove("d-none");
    signupForm.reset();
  });
}
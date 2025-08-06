function showTab(tabId) {
  console.log(`Switching to tab: ${tabId}`);
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  const target = document.getElementById(tabId);
  if (target) {
    target.classList.add('active');
  } else {
    console.error(`Tab with ID "${tabId}" not found.`);
  }
}

window.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded, loading content...");

    document.querySelectorAll("nav button").forEach(button => {
        button.addEventListener("click", () => {
        const tab = button.getAttribute("data-tab");
        showTab(tab);
    });
  });

  loadBanlist().catch(console.error);
  loadFunnyList().catch(console.error);
});

async function fetchCardImage(cardName){
    const apiUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(cardName)}`;
    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        return data.data[0].card_images[0].image_url;
    } catch (err) {
        return "fallback.png";
    }
}

async function createCardElement(card){
    const imgSrc = await fetchCardImage(card.name)
    const cardDiv = document.createElement('div')
    cardDiv.className = 'card';
    cardDiv.innerHTML = `
        <img src="${imgSrc}" alt="${card.name}" onerror="this.src='fallback.png'">
        <div>
        <strong>${card.name}</strong>
        <p>${card.reason}</p>
        </div>
    `;
    return cardDiv;
}

//Banlist
async function loadBanlist() {
  const container = document.getElementById('banlist-content');
  const res = await fetch('banlist.json');
  const banlist = await res.json();

  for (const section of ['banned', 'limited', 'semi_limited', 'suspect']) {
    if (banlist[section].length === 0) continue;
    const header = document.createElement('h3');
    header.textContent = section.replace('_', ' ').toUpperCase();
    container.appendChild(header);

    for (const card of banlist[section]) {
      const cardElement = await createCardElement(card);
      container.appendChild(cardElement);
    }
  }
}

//Funny One Ofs
async function loadFunnyList() {
  const container = document.getElementById('funny-cards');
  const res = await fetch('funnies.json');
  const funnyCards = await res.json();

  for (const card of funnyCards) {
    const cardElement = await createCardElement(card);
    container.appendChild(cardElement);
  }
}
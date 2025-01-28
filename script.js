const API_BASE_URL = 'https://api.coingecko.com/api/v3';

async function getTopCryptos() {
    try {
        const response = await fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=true&price_change_percentage=1h,24h,30d`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        return [];
    }
}

function createCryptoCard(crypto) {
    const card = document.createElement('a');
    card.href = `crypto.html?id=${crypto.id}`;
    card.classList.add('crypto-card');
    card.target = '_blank';

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('crypto-info');

    const name = document.createElement('h3');
    name.classList.add('crypto-name');
    name.textContent = crypto.name;

    const symbolSpan = document.createElement('span');
    symbolSpan.classList.add('crypto-symbol');
    symbolSpan.textContent = crypto.symbol.toUpperCase();
    name.appendChild(symbolSpan);

    infoDiv.appendChild(name);

    const price = document.createElement('p');
    price.classList.add('crypto-price');
    price.textContent = `\$${crypto.current_price.toFixed(2)}`;
    infoDiv.appendChild(price);

    const priceChange24h = crypto.price_change_percentage_24h_in_currency;
    const priceChange = document.createElement('span');
    priceChange.classList.add('price-change');
    priceChange.textContent = `(${priceChange24h.toFixed(2)}%)`;
    if (priceChange24h >= 0) {
        priceChange.classList.add('positive');
    } else {
        priceChange.classList.add('negative');
    }
    price.appendChild(priceChange);

    const stats = document.createElement('div');
    stats.classList.add('crypto-stats');

    const hourlyChange = crypto.price_change_percentage_1h_in_currency;
    const dailyChange = crypto.price_change_percentage_24h_in_currency;
    const monthlyChange = crypto.price_change_percentage_30d_in_currency;

    stats.innerHTML = `
        <span class="${hourlyChange >= 0 ? 'positive' : 'negative'}">1h: ${hourlyChange.toFixed(2)}%</span>
        <span class="${dailyChange >= 0 ? 'positive' : 'negative'}">24h: ${dailyChange.toFixed(2)}%</span>
        <span class="${monthlyChange >= 0 ? 'positive' : 'negative'}">30d: ${monthlyChange.toFixed(2)}%</span>
    `;

    infoDiv.appendChild(stats);
    card.appendChild(infoDiv);

    // Create a container for the chart
    const chartDiv = document.createElement('div');
    chartDiv.classList.add('crypto-chart');

    // Append the chart container to the card
    card.appendChild(chartDiv);

    return card;
}

function displayCryptoList(cryptos) {
    const cryptoListContainer = document.querySelector('.crypto-grid');
    cryptoListContainer.innerHTML = '';

    cryptos.forEach(crypto => {
        const cryptoCard = createCryptoCard(crypto);
        cryptoListContainer.appendChild(cryptoCard);
    });
}

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    resetParticle(particle);
    return particle;
}

function resetParticle(particle) {
      const size = Math.random() * 8 + 4;  // Increased size
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const duration = Math.random() * 6 + 4;
    const delay = Math.random() * 4;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.opacity = 0;
    particle.style.animation = `floatAndFade ${duration}s linear ${delay}s infinite`;

    // Reset position after animation ends
    setTimeout(() => {
        resetParticle(particle);
    }, duration * 1000 + delay * 1000);
}

function createParticles() {
    const particleContainer = document.getElementById('particle-container');
    const numParticles = 50;

    for (let i = 0; i < numParticles; i++) {
        const particle = createParticle();
        particleContainer.appendChild(particle);
    }
}

async function init() {
    const topCryptos = await getTopCryptos();
    displayCryptoList(topCryptos);
}

// Initialize particles and fetch cryptos when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    init();
});

// Custom Cursor
const cursor = document.getElementById('custom-cursor');
let cursorX = 0;
let cursorY = 0;
let mouseX = 0;
let mouseY = 0;
const speed = 0.12; // Lower value for slower movement

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursorPosition() {
    const distX = mouseX - cursorX;
    const distY = mouseY - cursorY;

    cursorX += distX * speed;
    cursorY += distY * speed;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(updateCursorPosition);
}

document.addEventListener('mouseover', () => {
    document.body.classList.add('active-cursor');
});

document.addEventListener('mouseout', () => {
    document.body.classList.remove('active-cursor');
});

updateCursorPosition();
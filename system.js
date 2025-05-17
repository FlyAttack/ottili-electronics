// system.js

// Produkte laden und anzeigen
async function loadProducts() {
  try {
    const response = await fetch('data/products.json');
    const data = await response.json();
    displayProducts(data.products);
  } catch (error) {
    console.error('Fehler beim Laden der Produkte:', error);
  }
}

function displayProducts(products) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.images && product.images[0] ? product.images[0] : ''}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${Number(product.price).toFixed(2)} €</p>
        <span class="product-condition condition-${product.condition}">
          ${getConditionText(product.condition)}
        </span>
        <p class="product-stock">${product.stock} verfügbar</p>
        <p class="product-description">${product.description}</p>
        <div class="product-actions">
          <button class="btn btn-primary" onclick="showProductDetails('${product.id}')">
            Details anzeigen
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function getConditionText(condition) {
  const conditions = {
    'new': 'Wie neu',
    'good': 'Sehr gut',
    'fair': 'Gut'
  };
  return conditions[condition] || condition;
}

function showProductDetails(productId) {
  // Hier können Sie ein Modal mit den Produktdetails anzeigen
  // oder zur Produktdetailseite navigieren
}

// Initialisierung für die Produktseite
function initializeProductPage() {
  // Produkte beim Laden der Seite anzeigen
  document.addEventListener('DOMContentLoaded', loadProducts);

  // Suchfunktion
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const products = document.querySelectorAll('.product-card');
      products.forEach(product => {
        const title = product.querySelector('.product-title').textContent.toLowerCase();
        const description = product.querySelector('.product-description').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });
    });
  }

  // Filterfunktion
  const conditionFilter = document.getElementById('condition-filter');
  if (conditionFilter) {
    conditionFilter.addEventListener('change', (e) => {
      const condition = e.target.value;
      const products = document.querySelectorAll('.product-card');
      products.forEach(product => {
        if (condition === 'all' || product.querySelector('.product-condition').classList.contains(`condition-${condition}`)) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });
    });
  }

  // Sortierfunktion
  const sortFilter = document.getElementById('sort-filter');
  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      const sortBy = e.target.value;
      const grid = document.getElementById('products-grid');
      const products = Array.from(grid.children);
      products.sort((a, b) => {
        const aValue = a.querySelector(sortBy.includes('price') ? '.product-price' : '.product-title').textContent;
        const bValue = b.querySelector(sortBy.includes('price') ? '.product-price' : '.product-title').textContent;
        if (sortBy.includes('price')) {
          return sortBy.includes('asc') 
            ? parseFloat(aValue) - parseFloat(bValue)
            : parseFloat(bValue) - parseFloat(aValue);
        } else {
          return sortBy.includes('asc')
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      });
      products.forEach(product => grid.appendChild(product));
    });
  }
}

// Automatisch initialisieren, wenn die Datei eingebunden wird
initializeProductPage(); 

// Website laden Nachricht
console.log('Website erfolgreich geladen!');

// Funktion zur IP Adresse laden und an die FlyAttack API senden
async function getIP() {
    try {
        // IP-Adresse abrufen
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ipAddress = data.ip;

        // IP-Adresse an FlyAttack API senden
        const apiResponse = await fetch('https://api.flyattack.com/ip-logger', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer oe-fa-ip'
            },
            body: JSON.stringify({
                ip: ipAddress,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer
            })
        });

        if (!apiResponse.ok) {
            throw new Error('...');
        }

        // IP-Adresse im UI anzeigen (falls gewünscht)
        const ipElement = document.getElementById('ip');
        if (ipElement) {
            ipElement.innerText = ipAddress;
        }

        console.log('IP-Adresse erfolgreich an FlyAttack API gesendet');
    } catch (error) {
        console.error('Fehler beim IP-Logging:', error);
    }
}

// IP-Logging beim Laden der Seite starten
document.addEventListener('DOMContentLoaded', getIP);

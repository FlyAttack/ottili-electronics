// Benutzerdaten
const users = {
    'williott8411': '?OEFlyAttack!3',
    'NoobiArtur': 'williott8411Artur',
    'admin': '?OEFlyAttack!3'
};

// DOM Elements
const loginContainer = document.getElementById('login-container');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const adminUsername = document.getElementById('admin-username');
const modalContainer = document.getElementById('modal-container');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');

// Login Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username] === password) {
        loginContainer.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        adminUsername.textContent = username;
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);
    } else {
        alert('Ungültige Anmeldedaten!');
    }
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    loginContainer.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
    loginForm.reset();
});

// Check Login Status
function checkLoginStatus() {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        loginContainer.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        adminUsername.textContent = localStorage.getItem('adminUsername');
    }
}

// Modal Functions
function showModal(content) {
    modalBody.innerHTML = content;
    modalContainer.classList.remove('hidden');
}

function hideModal() {
    modalContainer.classList.add('hidden');
    modalBody.innerHTML = '';
}

modalClose.addEventListener('click', hideModal);
modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
        hideModal();
    }
});

// Produktdaten
let products = [
    {
        id: "P001",
        name: "iPhone 13 Pro",
        price: 799.99,
        condition: "new",
        description: "Wie neu, 256GB, Graphite",
        image: "img/products/iphone13pro.jpg",
        stock: 5,
        created: "2024-03-20"
    },
    {
        id: "P002",
        name: "Samsung Galaxy S21",
        price: 599.99,
        condition: "good",
        description: "Sehr guter Zustand, 128GB, Phantom Gray",
        image: "img/products/s21.jpg",
        stock: 3,
        created: "2024-03-20"
    }
];

// Bestellungsdaten
let orders = [];

// Kundennummer-Generator
function generateCustomerId(customerType, status) {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const randomDigit = Math.floor(Math.random() * 3) + 5; // 5, 6 oder 7
    const customerCount = orders.length + 1;
    const customerNumber = customerCount.toString().padStart(2, '0');
    
    // Sicherheitscode berechnen
    const securityCode = ((parseInt(year) * parseInt(month)) % 89).toString().padStart(2, '0');
    
    return `#${randomDigit}${customerNumber}${year}${month}${status}${customerType}${securityCode}`;
}

// Produktdatenbank-Funktionen
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        products = data.products;
        updateProductList();
    } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error);
        products = [];
    }
}

async function saveProducts() {
    try {
        const response = await fetch('data/products.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ products }),
        });
        if (!response.ok) {
            throw new Error('Fehler beim Speichern der Produkte');
        }
    } catch (error) {
        console.error('Fehler beim Speichern der Produkte:', error);
        alert('Fehler beim Speichern der Produkte. Bitte versuchen Sie es später erneut.');
    }
}

// Produktverwaltung
function showAddProductModal() {
    const content = `
        <h2>Produkt erstellen</h2>
        <form id="add-product-form" class="product-form">
            <div class="form-group">
                <label for="product-name">Produktname</label>
                <input type="text" id="product-name" required>
            </div>
            <div class="form-group">
                <label for="product-price">Preis (€)</label>
                <input type="number" id="product-price" step="0.01" min="0" required>
            </div>
            <div class="form-group">
                <label for="product-condition">Zustand</label>
                <select id="product-condition" required>
                    <option value="new">Wie neu</option>
                    <option value="good">Sehr gut</option>
                    <option value="fair">Gut</option>
                </select>
            </div>
            <div class="form-group">
                <label for="product-description">Beschreibung</label>
                <textarea id="product-description" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label for="product-specs">Technische Details</label>
                <textarea id="product-specs" rows="4" placeholder="z.B. Speicher, Farbe, Modell..."></textarea>
            </div>
            <div class="form-group">
                <label for="product-stock">Lagerbestand</label>
                <input type="number" id="product-stock" min="0" required>
            </div>
            <div class="form-group">
                <label for="product-images">Produktbilder</label>
                <input type="file" id="product-images" accept="image/*" multiple required>
                <div id="image-preview" class="image-preview"></div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Produkt erstellen</button>
                <button type="button" class="btn btn-secondary" onclick="hideModal()">Abbrechen</button>
            </div>
        </form>
    `;
    showModal(content);

    // Bildvorschau
    const imageInput = document.getElementById('product-images');
    const imagePreview = document.getElementById('image-preview');
    
    imageInput.addEventListener('change', (e) => {
        imagePreview.innerHTML = '';
        Array.from(e.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });

    document.getElementById('add-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        const imageFiles = document.getElementById('product-images').files;
        Array.from(imageFiles).forEach(file => {
            formData.append('images', file);
        });

        try {
            // Bilder hochladen
            const uploadResponse = await fetch('/upload-images', {
                method: 'POST',
                body: formData
            });
            
            if (!uploadResponse.ok) {
                throw new Error('Fehler beim Hochladen der Bilder');
            }
            
            const imageUrls = await uploadResponse.json();

            // Neues Produkt erstellen
            const newProduct = {
                id: `P${(products.length + 1).toString().padStart(3, '0')}`,
                name: document.getElementById('product-name').value,
                price: parseFloat(document.getElementById('product-price').value),
                condition: document.getElementById('product-condition').value,
                description: document.getElementById('product-description').value,
                specs: document.getElementById('product-specs').value,
                stock: parseInt(document.getElementById('product-stock').value),
                images: imageUrls,
                created: new Date().toISOString().split('T')[0]
            };

            products.push(newProduct);
            await saveProducts();
            updateProductList();
            hideModal();
        } catch (error) {
            console.error('Fehler beim Erstellen des Produkts:', error);
            alert('Fehler beim Erstellen des Produkts. Bitte versuchen Sie es später erneut.');
        }
    });
}

function showEditProductsModal() {
    const content = `
        <h2>Produkte bearbeiten</h2>
        <div class="product-list">
            ${products.map(product => `
                <div class="list-item">
                    <h3>${product.name}</h3>
                    <p>Preis: ${product.price}€</p>
                    <p>Zustand: ${product.condition}</p>
                    <p>Lagerbestand: ${product.stock}</p>
                    <div class="action-buttons">
                        <button class="btn btn-secondary" onclick="editProduct('${product.id}')">
                            <i class="fas fa-edit"></i> Bearbeiten
                        </button>
                        <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">
                            <i class="fas fa-trash"></i> Löschen
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    showModal(content);
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const content = `
        <h2>Produkt bearbeiten</h2>
        <form id="edit-product-form">
            <div class="form-group">
                <label for="edit-product-name">Produktname</label>
                <input type="text" id="edit-product-name" value="${product.name}" required>
            </div>
            <div class="form-group">
                <label for="edit-product-price">Preis</label>
                <input type="number" id="edit-product-price" value="${product.price}" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="edit-product-condition">Zustand</label>
                <select id="edit-product-condition" required>
                    <option value="new" ${product.condition === 'new' ? 'selected' : ''}>Wie neu</option>
                    <option value="good" ${product.condition === 'good' ? 'selected' : ''}>Sehr gut</option>
                    <option value="fair" ${product.condition === 'fair' ? 'selected' : ''}>Gut</option>
                </select>
            </div>
            <div class="form-group">
                <label for="edit-product-description">Beschreibung</label>
                <textarea id="edit-product-description" rows="4" required>${product.description}</textarea>
            </div>
            <div class="form-group">
                <label for="edit-product-stock">Lagerbestand</label>
                <input type="number" id="edit-product-stock" value="${product.stock}" min="0" required>
            </div>
            <button type="submit" class="btn btn-primary">Änderungen speichern</button>
        </form>
    `;
    showModal(content);

    document.getElementById('edit-product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const index = products.findIndex(p => p.id === productId);
        if (index === -1) return;

        products[index] = {
            ...product,
            name: document.getElementById('edit-product-name').value,
            price: parseFloat(document.getElementById('edit-product-price').value),
            condition: document.getElementById('edit-product-condition').value,
            description: document.getElementById('edit-product-description').value,
            stock: parseInt(document.getElementById('edit-product-stock').value)
        };
        updateProductList();
        hideModal();
    });
}

function deleteProduct(productId) {
    if (confirm('Möchten Sie dieses Produkt wirklich löschen?')) {
        products = products.filter(p => p.id !== productId);
        updateProductList();
    }
}

function updateProductList() {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = products.map(product => `
        <div class="list-item">
            <h3>${product.name}</h3>
            <p>Preis: ${product.price}€</p>
            <p>Zustand: ${product.condition}</p>
            <p>Lagerbestand: ${product.stock}</p>
            <div class="action-buttons">
                <button class="btn btn-secondary" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i> Bearbeiten
                </button>
                <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i> Löschen
                </button>
            </div>
        </div>
    `).join('');
}

// Bestellungsverwaltung
function showAddOrderModal() {
    const content = `
        <h2>Neue Bestellung</h2>
        <form id="add-order-form">
            <div class="form-group">
                <label for="order-product">Produkt</label>
                <select id="order-product" required>
                    ${products.map(product => `
                        <option value="${product.id}">${product.name} - ${product.price}€</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="order-customer-type">Kundenart</label>
                <select id="order-customer-type" required>
                    <option value="1">Kunde</option>
                    <option value="2">Interessent</option>
                </select>
            </div>
            <div class="form-group">
                <label for="order-customer-status">Kundenstatus</label>
                <select id="order-customer-status" required>
                    <option value="X">Guter Status</option>
                    <option value="Y">Schlechter Status</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Bestellung erstellen</button>
        </form>
    `;
    showModal(content);

    document.getElementById('add-order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const productId = document.getElementById('order-product').value;
        const customerType = document.getElementById('order-customer-type').value;
        const customerStatus = document.getElementById('order-customer-status').value;
        
        const product = products.find(p => p.id === productId);
        if (!product || product.stock <= 0) {
            alert('Produkt nicht verfügbar!');
            return;
        }

        const customerId = generateCustomerId(customerType, customerStatus);
        const newOrder = {
            id: `O${(orders.length + 1).toString().padStart(3, '0')}`,
            productId,
            customerId,
            date: new Date().toISOString(),
            status: 'new',
            total: product.price
        };

        orders.push(newOrder);
        product.stock--;
        updateOrderList();
        updateProductList();
        hideModal();
    });
}

function updateOrderList() {
    const orderList = document.getElementById('order-list');
    if (!orderList) return;

    orderList.innerHTML = orders.map(order => {
        const product = products.find(p => p.id === order.productId);
        return `
            <div class="list-item">
                <h3>Bestellung ${order.id}</h3>
                <p>Produkt: ${product ? product.name : 'Unbekannt'}</p>
                <p>Kundennummer: ${order.customerId}</p>
                <p>Datum: ${new Date(order.date).toLocaleDateString()}</p>
                <p>Status: ${order.status}</p>
                <p>Gesamtbetrag: ${order.total}€</p>
                <div class="action-buttons">
                    <button class="btn btn-secondary" onclick="updateOrderStatus('${order.id}')">
                        <i class="fas fa-edit"></i> Status ändern
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function updateOrderStatus(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const content = `
        <h2>Bestellstatus ändern</h2>
        <form id="update-order-form">
            <div class="form-group">
                <label for="order-status">Status</label>
                <select id="order-status" required>
                    <option value="new" ${order.status === 'new' ? 'selected' : ''}>Neu</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>In Bearbeitung</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Versendet</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Geliefert</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Storniert</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Status aktualisieren</button>
        </form>
    `;
    showModal(content);

    document.getElementById('update-order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newStatus = document.getElementById('order-status').value;
        const index = orders.findIndex(o => o.id === orderId);
        if (index === -1) return;

        orders[index].status = newStatus;
        updateOrderList();
        hideModal();
    });
}

// Content Management
function initializeEditor() {
    const pageSelector = document.getElementById('page-selector');
    const editorContainer = document.getElementById('editor-container');

    pageSelector.addEventListener('change', (e) => {
        const selectedPage = e.target.value;
        // Hier Editor für die ausgewählte Seite initialisieren
    });
}

// User Management
function showAddUserModal() {
    const content = `
        <h2>Benutzer hinzufügen</h2>
        <form id="add-user-form">
            <div class="form-group">
                <label for="new-username">Benutzername</label>
                <input type="text" id="new-username" required>
            </div>
            <div class="form-group">
                <label for="new-password">Passwort</label>
                <input type="password" id="new-password" required>
            </div>
            <div class="form-group">
                <label for="confirm-password">Passwort bestätigen</label>
                <input type="password" id="confirm-password" required>
            </div>
            <button type="submit" class="btn btn-primary">Benutzer hinzufügen</button>
        </form>
    `;
    showModal(content);

    document.getElementById('add-user-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Hier Benutzer hinzufügen
        hideModal();
    });
}

// Analytics
function initializeCharts() {
    // Hier Charts initialisieren
}

// Settings
function initializeSettings() {
    const maintenanceMode = document.getElementById('maintenance-mode');
    const emailNotifications = document.getElementById('email-notifications');

    maintenanceMode.addEventListener('change', (e) => {
        // Hier Wartungsmodus umschalten
    });

    emailNotifications.addEventListener('change', (e) => {
        // Hier E-Mail-Benachrichtigungen umschalten
    });
}

// IP-Adressen laden und anzeigen
async function loadIPAddresses() {
    try {
        const response = await fetch('https://api.flyattack.com/ip-logger/list', {
            headers: {
                'Authorization': 'Bearer oe-fa-ip'
            }
        });
        
        if (!response.ok) {
            throw new Error('...');
        }

        const data = await response.json();
        const ipList = document.getElementById('ip-list');
        if (!ipList) return;

        ipList.innerHTML = data.map(entry => `
            <div class="list-item">
                <div class="ip-info">
                    <h3>IP: ${entry.ip}</h3>
                    <p>Zeitpunkt: ${new Date(entry.timestamp).toLocaleString()}</p>
                    <p>User Agent: ${entry.userAgent}</p>
                    <p>Referrer: ${entry.referrer || 'Direkter Zugriff'}</p>
                </div>
                <div class="ip-actions">
                    <button class="btn btn-danger" onclick="deleteIPEntry('${entry.id}')">
                        <i class="fas fa-trash"></i> Löschen
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Fehler beim Laden der IP-Adressen:', error);
        const ipList = document.getElementById('ip-list');
        if (ipList) {
            ipList.innerHTML = '<div class="error-message">Fehler beim Laden der IP-Adressen</div>';
        }
    }
}

// IP-Eintrag löschen
async function deleteIPEntry(id) {
    if (!confirm('Möchten Sie diesen IP-Eintrag wirklich löschen?')) return;

    try {
        const response = await fetch(`https://api.flyattack.com/ip-logger/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer oe-fa-ip'
            }
        });

        if (!response.ok) {
            throw new Error('...');
        }

        // Liste neu laden
        loadIPAddresses();
    } catch (error) {
        console.error('Fehler beim Löschen des IP-Eintrags:', error);
        alert('Fehler beim Löschen des IP-Eintrags');
    }
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadProducts();
    initializeEditor();
    updateOrderList();
    initializeCharts();
    initializeSettings();
    loadIPAddresses(); // IP-Adressen beim Laden laden
}); 
/* --- BASE DE DATOS DE PRODUCTOS (CON VARIACIONES) --- */
const productsDB = {
    'cyber-force': {
        title: 'CYBER FORCE 1',
        price: 180,
        desc: 'La leyenda clásica rediseñada para el metaverso. Cuero sintético reactivo y suela con cámara de aire visible.',
        // Aquí definimos las imágenes por color
        variations: [
            { color: '#ffffff', img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=600&auto=format&fit=crop', name: 'White' },
            { color: '#111111', img: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=600&auto=format&fit=crop', name: 'Black' },
            { color: '#aa0000', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop', name: 'Red' },
            { color: '#00aa44', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop', name: 'Acid Green' }
        ],
        sizes: [ { val: '7', stock: true }, { val: '8', stock: true }, { val: '9', stock: false }, { val: '10', stock: true }, { val: '11', stock: true } ]
    },
    'acid-dunk': {
        title: 'ACID DUNK LOW',
        price: 220,
        desc: 'Colores tóxicos para un estilo agresivo. Grip mejorado para skate urbano nocturno.',
        variations: [
            { color: '#00aa44', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop', name: 'Acid Green' },
            { color: '#ffffff', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop', name: 'Ghost White' }
        ],
        sizes: [ { val: '7', stock: false }, { val: '8', stock: true }, { val: '9', stock: true }, { val: '10', stock: true } ]
    },
    'void-jordan': {
        title: 'VOID JORDAN 1',
        price: 250,
        desc: 'El vacío hecho zapatilla. Materiales absorbentes de luz y confort premium.',
        variations: [
            { color: '#5d3fd3', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=600&auto=format&fit=crop', name: 'Royal Purple' },
            { color: '#111111', img: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=600&auto=format&fit=crop', name: 'Onyx Black' }
        ],
        sizes: [ { val: '8', stock: true }, { val: '9', stock: true }, { val: '10', stock: true }, { val: '11', stock: false } ]
    },
    'yeezy-boost': {
        title: 'YEEZY BOOST',
        price: 300,
        desc: 'Tecnología Boost de retorno de energía. Tejido Primeknit ultra ligero.',
        variations: [
            { color: '#eeeeee', img: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aef4?q=80&w=600&auto=format&fit=crop', name: 'Static' },
            { color: '#333333', img: 'https://images.unsplash.com/photo-1617606002779-51d866bdd1d1?q=80&w=600&auto=format&fit=crop', name: 'Cinder' }
        ],
        sizes: [ { val: '8', stock: true }, { val: '9', stock: true }, { val: '10', stock: true } ]
    }
};

/* --- LÓGICA DEL MODAL (Actualizada para cambio de color) --- */
const modalOverlay = document.getElementById('productModalOverlay');
const modalWindow = document.getElementById('productModalWindow');
let currentProduct = null;
let currentVariation = null;

function openProductModal(id) {
    const product = productsDB[id];
    if(!product) return console.error('Producto no encontrado');
    
    currentProduct = product;
    // Seleccionar la primera variación por defecto
    currentVariation = product.variations[0]; 

    // Llenar Datos Iniciales
    updateModalImage(currentVariation.img);
    document.getElementById('m-title').innerText = product.title;
    document.getElementById('m-price').innerText = `$${product.price}`;
    document.getElementById('m-desc').innerText = product.desc;
    
    // Configurar Botón Agregar (Ahora incluye el color seleccionado)
    document.getElementById('m-add-btn').onclick = function() {
        // Guardamos el nombre + el color elegido
        addToCart(`${product.title} (${currentVariation.name})`, product.price);
        closeProductModal();
    };

    // GENERAR TALLES
    const sizesContainer = document.getElementById('m-sizes');
    sizesContainer.innerHTML = '';
    product.sizes.forEach(size => {
        const btn = document.createElement('button');
        btn.className = `size-btn ${size.stock ? '' : 'disabled'}`;
        btn.innerText = size.val;
        if(size.stock) btn.onclick = () => {
            document.querySelectorAll('.size-btn').forEach(b => b.style.borderColor = '#333');
            btn.style.borderColor = '#ccff00';
        };
        sizesContainer.appendChild(btn);
    });

    // GENERAR COLORES (Aquí está la magia)
    const colorsContainer = document.getElementById('m-colors');
    colorsContainer.innerHTML = '';
    
    product.variations.forEach((variation, index) => {
        const circle = document.createElement('div');
        circle.className = 'color-circle';
        circle.style.backgroundColor = variation.color;
        
        // Marcar el primero como activo
        if(index === 0) circle.classList.add('active-color');

        // Evento Click: Cambiar Imagen
        circle.onclick = function() {
            // Actualizar imagen
            updateModalImage(variation.img);
            currentVariation = variation; // Actualizar selección actual
            
            // Actualizar estilo visual del círculo
            document.querySelectorAll('.color-circle').forEach(c => c.style.border = '2px solid #333');
            circle.style.border = '2px solid #fff'; // Borde blanco para el seleccionado
        };
        
        colorsContainer.appendChild(circle);
    });

    // Mostrar Modal
    modalOverlay.classList.add('active');
    setTimeout(() => { modalWindow.classList.add('active'); }, 10);
}

// Función auxiliar para animar el cambio de imagen
function updateModalImage(src) {
    const imgElement = document.getElementById('m-img');
    imgElement.style.opacity = '0'; // Desvanecer
    setTimeout(() => {
        imgElement.src = src;
        imgElement.onload = () => { imgElement.style.opacity = '1'; }; // Aparecer cuando cargue
    }, 200);
}

function closeProductModal() {
    modalWindow.classList.remove('active');
    setTimeout(() => { modalOverlay.classList.remove('active'); }, 300);
}

/* --- TILT 3D EFECTO --- */
const cards = document.querySelectorAll('.product-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`; });
});

/* --- MENÚ HAMBURGUESA --- */
function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }

/* --- FILTROS Y BUSCADOR --- */
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const allProducts = document.querySelectorAll('.product-card');
const noResultsMsg = document.getElementById('no-results');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterProducts(btn.getAttribute('data-filter'), searchInput.value);
    });
});

searchInput.addEventListener('keyup', (e) => {
    const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    filterProducts(activeCategory, e.target.value);
});

function filterProducts(category, searchText) {
    let visibleCount = 0;
    const term = searchText.toLowerCase();
    allProducts.forEach(card => {
        const productCategory = card.getAttribute('data-category');
        const productName = card.querySelector('h3').innerText.toLowerCase();
        const matchCat = (category === 'all') || (productCategory === category);
        const matchText = productName.includes(term);
        if (matchCat && matchText) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    noResultsMsg.style.display = (visibleCount === 0) ? 'block' : 'none';
}

/* --- CARRITO --- */
let cart = [];
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.querySelector('.cart-overlay').classList.toggle('open');
}
function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
}
function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    container.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        container.innerHTML += `<div class="cart-item"><div style="font-family: var(--font-body)">${item.name}</div><div style="color:var(--acid)">$${item.price}</div></div>`;
    });
    if(cart.length === 0) container.innerHTML = '<div class="empty-cart" style="text-align:center; color:#666">VACÍO</div>';
    totalEl.innerText = `$${total.toFixed(2)}`;
    countEl.innerText = cart.length;
    if(!document.getElementById('cartSidebar').classList.contains('open')) toggleCart();
}
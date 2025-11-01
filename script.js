// نظام مؤسسة اليمن الدوائية
class YemenPharmaSystem {
    constructor() {
        this.currentUser = null;
        this.products = [];
        this.cart = [];
        this.init();
    }

    init() {
        this.setupLoading();
        this.setupNavigation();
        this.setupEventListeners();
        this.loadProducts();
        this.loadCart();
        this.checkAuthStatus();
    }

    setupLoading() {
        // إخفاء شاشة التحميل بعد تحميل الصفحة
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loading').classList.add('hidden');
            }, 1000);
        });
    }

    setupNavigation() {
        // التنقل بين الأقسام
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.showSection(sectionId);
                
                // تحديث القائمة النشطة
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // القائمة المتنقلة
        const mobileMenu = document.getElementById('mobileMenu');
        const navLinks = document.getElementById('navLinks');
        
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                navLinks.classList.remove('active');
            }
        });

        // تغيير لون النافبار عند التمرير
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    setupEventListeners() {
        // أحداث السلة
        document.getElementById('cartBtn').addEventListener('click', () => this.toggleCart());
        document.getElementById('closeCart').addEventListener('click', () => this.hideCart());
        document.getElementById('checkoutBtn').addEventListener('click', () => this.checkout());

        // أحداث النماذج
        document.getElementById('userBtn').addEventListener('click', () => this.toggleUserMenu());
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('contactForm').addEventListener('submit', (e) => this.handleContact(e));

        // البحث في الوقت الحقيقي
        document.getElementById('productSearch').addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });

        // إغلاق السلة والنماذج عند النقر خارجها
        document.addEventListener('click', (e) => {
            // إغلاق السلة
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar && !cartSidebar.contains(e.target) && !e.target.closest('#cartBtn')) {
                this.hideCart();
            }

            // إغلاق النماذج
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
    }

    loadProducts() {
        // بيانات المنتجات
        this.products = [
            {
                id: 1,
                name: "أموكسيسيلين 500mg",
                category: "مضادات حيوية",
                price: 1200,
                originalPrice: 1500,
                description: "مضاد حيوي واسع المجال لعلاج الالتهابات البكتيرية في الجهاز التنفسي والجلد",
                image: "amoxicillin",
                featured: true,
                inStock: true
            },
            {
                id: 2,
                name: "باراسيتامول 500mg",
                category: "مسكنات",
                price: 800,
                originalPrice: 1000,
                description: "مسكن للألم وخافض للحرارة، مناسب للصداع وآلام العضلات",
                image: "paracetamol",
                featured: true,
                inStock: true
            },
            {
                id: 3,
                name: "حقن طبية معقمة",
                category: "مستلزمات طبية",
                price: 2500,
                description: "حقن طبية معقمة بمختلف المقاسات، صناعة ألمانية",
                image: "injections",
                featured: false,
                inStock: true
            },
            {
                id: 4,
                name: "فيتامين سي 1000mg",
                category: "فيتامينات",
                price: 1500,
                originalPrice: 1800,
                description: "مكمل غذائي عالي الجودة لدعم المناعة وصحة الجلد",
                image: "vitamin-c",
                featured: true,
                inStock: true
            },
            {
                id: 5,
                name: "أنسولين glargine",
                category: "أدوية مزمنة",
                price: 3500,
                description: "أنسولين طويل المفعول لمرضى السكري",
                image: "insulin",
                featured: false,
                inStock: true
            },
            {
                id: 6,
                name: "أجهزة قياس السكر",
                category: "مستلزمات طبية",
                price: 2800,
                originalPrice: 3200,
                description: "جهاز دقيق لقياس مستوى السكر في الدم مع شرائط مجانية",
                image: "glucometer",
                featured: true,
                inStock: true
            },
            {
                id: 7,
                name: "أوميغا 3",
                category: "مكملات غذائية",
                price: 2200,
                description: "زيت سمك غني بأحماض أوميغا 3 الدهنية لصحة القلب",
                image: "omega3",
                featured: false,
                inStock: true
            },
            {
                id: 8,
                name: "مستحضرات العناية بالبشرة",
                category: "مستحضرات تجميل طبية",
                price: 1800,
                description: "كريمات عناية طبية بالبشرة للبشرة الحساسة",
                image: "skincare",
                featured: true,
                inStock: true
            }
        ];

        this.displayProducts();
    }

    displayProducts() {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = this.products.map(product => `
            <div class="product-card fade-in">
                ${product.originalPrice ? `<div class="product-badge">عرض خاص</div>` : ''}
                <div class="product-image">
                    <i class="fas fa-pills"></i>
                </div>
                <div class="product-content">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        ${product.price.toLocaleString()} ريال
                        ${product.originalPrice ? 
                            `<small style="color: var(--text-light); text-decoration: line-through; margin-right: 0.5rem;">${product.originalPrice.toLocaleString()} ريال</small>` : 
                            ''
                        }
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="yemenPharma.addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> أضف إلى السلة
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    searchProducts(query) {
        if (!query.trim()) {
            this.displayProducts();
            return;
        }

        const filtered = this.products.filter(product =>
            product.name.includes(query) ||
            product.description.includes(query) ||
            product.category.includes(query)
        );

        this.displayFilteredProducts(filtered);
    }

    displayFilteredProducts(products) {
        const grid = document.getElementById('productsGrid');
        if (products.length === 0) {
            grid.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><p>لا توجد منتجات مطابقة للبحث</p></div>';
            return;
        }

        grid.innerHTML = products.map(product => `
            <div class="product-card fade-in">
                ${product.originalPrice ? `<div class="product-badge">عرض خاص</div>` : ''}
                <div class="product-image">
                    <i class="fas fa-pills"></i>
                </div>
                <div class="product-content">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        ${product.price.toLocaleString()} ريال
                        ${product.originalPrice ? 
                            `<small style="color: var(--text-light); text-decoration: line-through; margin-right: 0.5rem;">${product.originalPrice.toLocaleString()} ريال</small>` : 
                            ''
                        }
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="yemenPharma.addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> أضف إلى السلة
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterProducts() {
        const category = document.getElementById('categoryFilter').value;
        if (!category) {
            this.displayProducts();
            return;
        }

        const filtered = this.products.filter(product => product.category === category);
        this.displayFilteredProducts(filtered);
    }

    sortProducts() {
        const sortBy = document.getElementById('sortFilter').value;
        const sorted = [...this.products];

        if (sortBy === 'price') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'category') {
            sorted.sort((a, b) => a.category.localeCompare(b.category));
        } else {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        }

        this.displayFilteredProducts(sorted);
    }

    // نظام السلة
    loadCart() {
        const savedCart = localStorage.getItem('yemenPharmaCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartUI();
        }
    }

    saveCart() {
        localStorage.setItem('yemenPharmaCart', JSON.stringify(this.cart));
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification('تم إضافة المنتج إلى السلة', 'success');
        
        // إظهار السلة تلقائياً
        this.showCart();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.showNotification('تم إزالة المنتج من السلة', 'info');
    }

    updateCartQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    updateCartUI() {
        this.updateCartItems();
        this.updateCartBadge();
        this.updateCartSummary();
    }

    updateCartItems() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart" style="text-align: center; padding: 3rem; color: var(--text-light);">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p style="margin-bottom: 1.5rem;">سلة المشتريات فارغة</p>
                    <button class="btn btn-primary" onclick="showSection('products')">
                        <i class="fas fa-shopping-bag"></i> تصفح المنتجات
                    </button>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-pills"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ريال</div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="yemenPharma.updateCartQuantity(${item.id}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="yemenPharma.updateCartQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="yemenPharma.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (cartBadge) {
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    updateCartSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = this.cart.length > 0 ? 500 : 0;
        const total = subtotal + shipping;

        const subtotalEl = document.getElementById('cartSubtotal');
        const shippingEl = document.getElementById('cartShipping');
        const totalEl = document.getElementById('cartTotal');

        if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString()} ريال`;
        if (shippingEl) shippingEl.textContent = `${shipping.toLocaleString()} ريال`;
        if (totalEl) totalEl.textContent = `${total.toLocaleString()} ريال`;
    }

    showCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar.classList.contains('active')) {
            this.hideCart();
        } else {
            this.showCart();
        }
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('سلة المشتريات فارغة', 'error');
            return;
        }

        if (!this.currentUser) {
            this.showNotification('يجب تسجيل الدخول لإتمام الشراء', 'error');
            this.showLogin();
            this.hideCart();
            return;
        }

        // محاكاة عملية الدفع
        this.showNotification('جارٍ معالجة طلبك...', 'info');
        
        setTimeout(() => {
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.hideCart();
            this.showNotification('تم إنشاء الطلب بنجاح!', 'success');
        }, 2000);
    }

    // نظام المصادقة
    showLogin() {
        this.closeAllModals();
        document.getElementById('loginModal').classList.add('active');
    }

    showRegister() {
        this.closeAllModals();
        document.getElementById('registerModal').classList.add('active');
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    toggleUserMenu() {
        if (this.currentUser) {
            // في التطبيق الكامل، سيتم فتح قائمة المستخدم
            this.showNotification(`مرحباً ${this.currentUser.name}`, 'info');
        } else {
            this.showLogin();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        // محاكاة تسجيل الدخول
        this.currentUser = {
            id: 1,
            name: "أحمد محمد",
            email: "ahmed@example.com"
        };
        this.closeAllModals();
        this.showNotification('تم تسجيل الدخول بنجاح!', 'success');
    }

    handleRegister(e) {
        e.preventDefault();
        // محاكاة إنشاء حساب
        this.currentUser = {
            id: 1,
            name: "مستخدم جديد",
            email: "newuser@example.com"
        };
        this.closeAllModals();
        this.showNotification('تم إنشاء الحساب بنجاح!', 'success');
    }

    handleContact(e) {
        e.preventDefault();
        this.showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
        e.target.reset();
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('yemenPharmaCurrentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    // التنقل بين الأقسام
    showSection(sectionId) {
        // إخفاء جميع الأقسام
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // إظهار القسم المطلوب
        document.getElementById(sectionId).classList.add('active');
        
        // تحديث القائمة النشطة
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
        
        // التمرير للأعلى
        window.scrollTo(0, 0);
        
        // إغلاق القائمة المتنقلة إذا كانت مفتوحة
        document.getElementById('navLinks').classList.remove('active');
    }

    // نظام الإشعارات
    showNotification(message, type = 'info') {
        // إزالة أي إشعارات سابقة
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // إضافة الأنماط
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 4000;
            border-right: 4px solid ${this.getNotificationColor(type)};
            animation: slideInRight 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // إضافة أنيميشن الـ keyframes إذا لم تكن موجودة
        if (!document.querySelector('#notificationAnimation')) {
            const style = document.createElement('style');
            style.id = 'notificationAnimation';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // إزالة الإشعار بعد 4 ثواني
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'info': '#17a2b8'
        };
        return colors[type] || '#17a2b8';
    }
}

// الدوال العامة للاستخدام في HTML
function showSection(sectionId) {
    window.yemenPharma.showSection(sectionId);
}

function searchProducts() {
    const query = document.getElementById('productSearch').value;
    window.yemenPharma.searchProducts(query);
}

function filterProducts() {
    window.yemenPharma.filterProducts();
}

function sortProducts() {
    window.yemenPharma.sortProducts();
}

function showLogin() {
    window.yemenPharma.showLogin();
}

function showRegister() {
    window.yemenPharma.showRegister();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openWhatsApp() {
    window.open('https://wa.me/967712345678', '_blank');
}

function callUs() {
    window.location.href = 'tel:+9671123456';
}

function openChat() {
    window.yemenPharma.showNotification('سيتم تفعيل خدمة الدردشة قريباً', 'info');
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    window.yemenPharma = new YemenPharmaSystem();
});
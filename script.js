// API Configuration
const API_BASE_URL = 'https://admin.iyirooms.com/api/public';
let currentPage = 1;
let currentFilters = {};

// DOM Elements
const hotelsContainer = document.getElementById('hotels-container');
const cityFilter = document.getElementById('city-filter');
const priceFilter = document.getElementById('price-filter');
const ratingFilter = document.getElementById('rating-filter');
const searchButton = document.getElementById('search-hotels');
const loadMoreButton = document.getElementById('load-more');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCities();
    loadHotels();
    setupEventListeners();
    setupAnimations();
    setupThemeToggle();
});

// Load cities for filter
async function loadCities() {
    try {
        const response = await fetch(`${API_BASE_URL}/hotels/cities`);
        const cities = await response.json();
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.city;
            option.textContent = `${city.city} (${city.hotelCount})`;
            cityFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading cities:', error);
    }
}

// Load hotels from API
async function loadHotels(reset = true) {
    if (reset) {
        currentPage = 1;
        hotelsContainer.innerHTML = '';
    }

    try {
        const params = new URLSearchParams({
            page: currentPage,
            size: 9,
            ...currentFilters
        });

        const response = await fetch(`${API_BASE_URL}/hotels?${params}`);
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            data.data.forEach(hotel => {
                const hotelCard = createHotelCard(hotel);
                hotelsContainer.appendChild(hotelCard);
            });

            // Show/hide load more button
            if (data.pagination && data.pagination.hasNextPage) {
                loadMoreButton.classList.remove('hidden');
            } else {
                loadMoreButton.classList.add('hidden');
            }
        } else {
            hotelsContainer.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">No hotels found</h3>
                    <p class="text-gray-500">Try adjusting your filters or search criteria</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading hotels:', error);
        hotelsContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">Error loading hotels</h3>
                <p class="text-gray-500">Please try again later</p>
            </div>
        `;
    }
}

// Create hotel card
function createHotelCard(hotel) {
    const card = document.createElement('div');
    card.className = 'hotel-card bg-white rounded-2xl shadow-soft overflow-hidden slide-up';
    
    const imageUrl = hotel.images && hotel.images.length > 0 ? hotel.images[0] : 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=iYi+Rooms';
    const price = hotel.priceRange ? hotel.priceRange.minPricePerNight : 'Contact for price';
    const rating = hotel.rating || 4.5;
    const stars = Math.floor(rating);

    card.innerHTML = `
        <div class="relative">
            <img src="${imageUrl}" alt="${hotel.name}" class="w-full h-48 object-cover" loading="lazy" />
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-brand-pink">
                <i class="fas fa-star text-yellow-400 mr-1"></i>${rating}
            </div>
        </div>
        <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2">${hotel.name}</h3>
            <p class="text-gray-600 mb-3 flex items-center">
                <i class="fas fa-map-marker-alt text-brand-pink mr-2"></i>
                ${hotel.city}, ${hotel.state}
            </p>
            <div class="flex items-center justify-between mb-4">
                <div class="flex text-yellow-400">
                    ${Array(stars).fill('<i class="fas fa-star"></i>').join('')}
                    ${Array(5 - stars).fill('<i class="far fa-star"></i>').join('')}
                </div>
                <span class="text-lg font-bold text-brand-pink">₹${price}</span>
            </div>
            <a href="https://play.google.com/store/apps/details?id=io.iyirooms.app&pcampaignid=web_share" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="w-full gradient-primary text-white font-semibold py-3 px-4 rounded-lg text-center block hover:shadow-hover transition-all duration-300">
                <i class="fas fa-external-link-alt mr-2"></i>
                View on App
            </a>
        </div>
    `;

    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Search button
    searchButton.addEventListener('click', () => {
        currentFilters = {
            city: cityFilter.value,
            minPrice: priceFilter.value.split('-')[0] || '',
            maxPrice: priceFilter.value.split('-')[1] || '',
            rating: ratingFilter.value || ''
        };
        loadHotels(true);
    });

    // Load more button
    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        loadHotels(false);
    });

    // Mobile menu
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Setup animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
        observer.observe(el);
    });
}

// Theme toggle
function setupThemeToggle() {
    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        const icon = isDark ? 'fa-sun' : 'fa-moon';
        document.querySelectorAll('#theme-toggle i, #theme-toggle-mobile i').forEach(el => {
            el.className = `fas ${icon} text-gray-600`;
        });
    };

    themeToggle.addEventListener('click', toggleTheme);
    themeToggleMobile.addEventListener('click', toggleTheme);

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.querySelectorAll('#theme-toggle i, #theme-toggle-mobile i').forEach(el => {
            el.className = 'fas fa-sun text-gray-600';
        });
    }
}

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});
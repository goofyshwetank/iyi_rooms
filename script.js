// API Configuration
const API_BASE_URL = 'https://admin.iyirooms.com/api/public';
let currentPage = 1;
let currentFilters = {};

// DOM Elements - Safe selection to avoid null errors
const hotelsContainer = document.getElementById('hotels-container') || document.getElementById('hotels-grid');
const hotelsLoading = document.getElementById('hotels-loading');
const hotelsError = document.getElementById('hotels-error');
const cityFilter = document.getElementById('city-filter');
const priceFilter = document.getElementById('price-filter');
const ratingFilter = document.getElementById('rating-filter');
const sortFilter = document.getElementById('sort-filter');
const radiusFilter = document.getElementById('radius-filter');
const searchButton = document.getElementById('search-hotels');
const loadMoreButton = document.getElementById('load-more') || document.getElementById('load-more-btn');
const loadMoreContainer = document.getElementById('load-more-container');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const nearbyBtn = document.getElementById('nearby-btn');
const moreHotelsBtn = document.getElementById('more-hotels-btn');
const clearFiltersBtn = document.getElementById('clear-filters');
const nearbyModal = document.getElementById('nearby-modal');
const closeNearbyModal = document.getElementById('close-nearby-modal');
const getLocationBtn = document.getElementById('get-location-btn');
const manualLocationBtn = document.getElementById('manual-location-btn');
const manualLocationInput = document.getElementById('manual-location-input');
const searchNearbyBtn = document.getElementById('search-nearby-btn');
const cancelNearbyBtn = document.getElementById('cancel-nearby-btn');
const radiusSelect = document.getElementById('radius-select');
const latInput = document.getElementById('lat-input');
const lngInput = document.getElementById('lng-input');
const resultsCount = document.getElementById('results-count');

// On site load, try to get user location and show nearby hotels
async function tryLoadNearbyHotels() {
    if (!navigator.geolocation) {
        return; // fallback already loaded
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
            // Show loading skeletons
            hotelsContainer.innerHTML = `${Array(3).fill(`
                <div class="hotel-card bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft overflow-hidden skeleton border border-white/20 flex flex-col h-full">
                    <div class="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0 rounded-t-3xl"></div>
                    <div class="p-6 flex flex-col flex-1 min-h-0">
                        <div class="flex-1 min-h-0">
                            <div class="h-6 bg-gray-200 rounded-lg mb-3"></div>
                            <div class="h-4 bg-gray-200 rounded mb-4"></div>
                            <div class="h-5 bg-gray-200 rounded mb-4"></div>
                            <div class="flex gap-2 mb-4">
                                <div class="h-5 w-12 bg-gray-200 rounded-full"></div>
                                <div class="h-5 w-16 bg-gray-200 rounded-full"></div>
                                <div class="h-5 w-10 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                        <div class="h-10 bg-gray-200 rounded-xl mt-auto"></div>
                    </div>
                </div>`).join('')}`;
            const params = new URLSearchParams({
                lat, lng, radius: 10, page: 1, size: 9
            });
            const response = await fetch(`${API_BASE_URL}/hotels/nearby?${params}`);
            const data = await response.json();
            // Remove skeletons and update only if nearby hotels found
            const hotelsNearby = data.Hotels || data.hotels;
            if (hotelsNearby && hotelsNearby.length > 0) {
                console.log('Nearby hotel sample:', hotelsNearby[0]);
                hotelsContainer.innerHTML = '';
                hotelsNearby.forEach(hotel => {
                    const hotelCard = createHotelCard(hotel);
                    hotelsContainer.appendChild(hotelCard);
                });
                // Hide load more button for nearby search
                loadMoreButton.classList.add('hidden');
            } // else: do nothing, keep default hotels
        } catch (e) {
            // fallback already loaded
        }
    }, (error) => {
        // fallback already loaded
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCities();
    loadHotels(); // always load default hotels first
    tryLoadNearbyHotels(); // update if permission granted
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
            if (city.city && city.city !== 'undefined' && city.city.trim() !== '') {
                const option = document.createElement('option');
                option.value = city.city;
                option.textContent = `${city.city} (${city.hotelCount})`;
                cityFilter.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading cities:', error);
    }
}

// Load hotels from API
async function loadHotels(reset = true) {
    if (!hotelsContainer) return;
    
    if (reset) {
        currentPage = 1;
        
        // Show loading state
        if (hotelsLoading) {
            hotelsLoading.classList.remove('hidden');
        }
        if (hotelsError) {
            hotelsError.classList.add('hidden');
        }
        if (hotelsContainer) {
            hotelsContainer.classList.add('hidden');
        }
    }

    try {
        const params = new URLSearchParams({
            page: currentPage,
            size: 9,
            ...currentFilters
        });

        const response = await fetch(`${API_BASE_URL}/hotels?${params}`);
        const data = await response.json();
        
        // Hide loading, show content
        if (hotelsLoading) {
            hotelsLoading.classList.add('hidden');
        }
        if (hotelsContainer) {
            hotelsContainer.classList.remove('hidden');
        }
        
        if (reset) {
            hotelsContainer.innerHTML = '';
        }

        if (data.Data && data.Data.length > 0) {
            data.Data.forEach(hotel => {
                const hotelCard = createHotelCard(hotel);
                hotelsContainer.appendChild(hotelCard);
            });

            // Update results count
            if (resultsCount) {
                const totalCount = data.Pagination ? data.Pagination.TotalCount : data.Data.length;
                resultsCount.textContent = `Found ${totalCount} hotels`;
            }

            // Show/hide load more button
            if (data.Pagination && data.Pagination.HasNextPage) {
                if (loadMoreButton) loadMoreButton.classList.remove('hidden');
                if (loadMoreContainer) loadMoreContainer.classList.remove('hidden');
            } else {
                if (loadMoreButton) loadMoreButton.classList.add('hidden');
                if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
            }
        } else {
            if(currentPage === 1) {
                hotelsContainer.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <div class="text-4xl text-gray-400 mb-4">🔍</div>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">No hotels found</h3>
                        <p class="text-gray-500">Try adjusting your filters or search criteria</p>
                    </div>
                `;
                if (resultsCount) {
                    resultsCount.textContent = 'No hotels found';
                }
            }
            if (loadMoreButton) loadMoreButton.classList.add('hidden');
            if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error loading hotels:', error);
        
        // Hide loading, show error
        if (hotelsLoading) {
            hotelsLoading.classList.add('hidden');
        }
        if (hotelsError) {
            hotelsError.classList.remove('hidden');
        } else if (hotelsContainer) {
            hotelsContainer.classList.remove('hidden');
        hotelsContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                    <div class="text-4xl text-red-400 mb-4">⚠️</div>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">Error loading hotels</h3>
                <p class="text-gray-500">Please try again later</p>
                    <button onclick="loadHotels()" class="mt-4 bg-brand-pink hover:bg-brand-pink-dark text-white font-bold py-2 px-6 rounded-lg">Try Again</button>
            </div>
        `;
        }
        if (resultsCount) {
            resultsCount.textContent = 'Error loading hotels';
        }
    }
}

// Create hotel card
function createHotelCard(hotel) {
    const card = document.createElement('div');
    card.className = 'hotel-card bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft overflow-hidden border border-white/20 flex flex-col h-full';
    
    const imageUrl = hotel.PrimaryPhoto ? `https://admin.iyirooms.com/upload/${hotel.PrimaryPhoto}` : 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=iYi+Rooms';
    const fallbackImageUrl = hotel.PrimaryPhoto ? `https://admin.iyirooms.com/${hotel.PrimaryPhoto}` : 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=iYi+Rooms';
    
    // Determine image display class based on source
    const imageClass = hotel.PrimaryPhoto ? 'w-full h-full object-cover object-center hotel-image' : 'w-full h-full object-contain bg-gray-100';
    const price = hotel.MinHourlyPrice ? Math.round(hotel.MinHourlyPrice) : 'N/A';
    const rating = 4.5; // API does not provide rating, using a default
    const stars = Math.floor(rating);

    // Truncate hotel name if too long
    const hotelName = hotel.Name.length > 30 ? hotel.Name.substring(0, 30) + '...' : hotel.Name;
    const hotelCity = hotel.City.length > 20 ? hotel.City.substring(0, 20) + '...' : hotel.City;

    card.innerHTML = `
        <div class="relative flex-shrink-0">
            <div class="w-full h-64 bg-gray-100 rounded-t-3xl overflow-hidden">
                <img src="${imageUrl}" alt="${hotel.Name}" class="${imageClass}"
                     onload="console.log('Image loaded successfully:', this.src);"
                     onerror="console.log('Image failed to load:', this.src); this.src='${fallbackImageUrl}'" />
            </div>
            <div class="absolute top-3 right-3 bg-brand-pink text-white px-2 py-1 rounded-full text-xs font-semibold">
                ${rating} ★
            </div>
            ${hotel.DistanceKm !== undefined ? `<div class='absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-brand-pink shadow'>${hotel.DistanceKm.toFixed(2)} km</div>` : ''}
        </div>
        <div class="p-6 flex flex-col flex-1 min-h-0">
            <div class="flex-1 min-h-0">
                <h3 class="text-lg font-bold text-gray-800 mb-3 line-clamp-2" title="${hotel.Name}">${hotelName}</h3>
                <p class="text-gray-600 mb-4 flex items-center text-sm">
                    <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="truncate" title="${hotel.City}">${hotelCity}</span>
                </p>
                <div class="flex items-center justify-between mb-4">
                    <span class="text-xl font-bold text-brand-pink">₹${price}</span>
                </div>
                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Wi-Fi</span>
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Breakfast</span>
                    <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Pool</span>
                </div>
            </div>
            <a href="https://play.google.com/store/apps/details?id=io.iyirooms.app&pcampaignid=web_share" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn-primary w-full text-center mt-auto">
                View in App
            </a>
        </div>
    `;
    return card;
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
    }

    // Filter change listeners
    if (cityFilter) {
        cityFilter.addEventListener('change', applyFilters);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }

    // Search button (legacy)
    if (searchButton) {
        searchButton.addEventListener('click', applyFilters);
    }

    // Nearby hotels button
    if (nearbyBtn && nearbyModal) {
        nearbyBtn.addEventListener('click', () => {
            nearbyModal.classList.remove('hidden');
        });
    }

    // Close nearby modal
    if (closeNearbyModal && nearbyModal) {
        closeNearbyModal.addEventListener('click', () => {
            nearbyModal.classList.add('hidden');
        });
    }

    // Cancel nearby search
    if (cancelNearbyBtn && nearbyModal) {
        cancelNearbyBtn.addEventListener('click', () => {
            nearbyModal.classList.add('hidden');
        });
    }

    // Manual location toggle
    if (manualLocationBtn && manualLocationInput) {
        manualLocationBtn.addEventListener('click', () => {
            manualLocationInput.classList.toggle('hidden');
        });
    }

    // Get user location
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getUserLocation);
    }

    // Search nearby
    if (searchNearbyBtn) {
        searchNearbyBtn.addEventListener('click', searchNearbyHotels);
    }

    // More hotels button
    if (moreHotelsBtn) {
        moreHotelsBtn.addEventListener('click', loadMoreHotels);
    }

    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    // Load more button
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', loadMoreHotels);
    }

    // Close modal when clicking outside
    if (nearbyModal) {
        nearbyModal.addEventListener('click', (e) => {
            if (e.target === nearbyModal) {
                nearbyModal.classList.add('hidden');
            }
        });
    }

    // Smooth scrolling for anchor links (only if on main page)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Apply current filters
function applyFilters() {
    currentFilters = {};
    
    if (cityFilter && cityFilter.value) {
        currentFilters.city = cityFilter.value;
    }
    if (priceFilter && priceFilter.value) {
        const [min, max] = priceFilter.value.split('-');
        currentFilters.minPrice = min;
        if (max && max !== '+') currentFilters.maxPrice = max;
    }
    if (ratingFilter && ratingFilter.value) {
        currentFilters.rating = ratingFilter.value;
    }
    
    loadHotels(true);
}

// Load more hotels
function loadMoreHotels() {
    currentPage++;
    loadHotels(false);
}

// Clear all filters
function clearAllFilters() {
    if (cityFilter) cityFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (sortFilter) sortFilter.value = 'name';
    if (radiusFilter) radiusFilter.value = '';
    
    currentFilters = {};
    loadHotels(true);
}

// Get user location
function getUserLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            if (latInput) latInput.value = position.coords.latitude;
            if (lngInput) lngInput.value = position.coords.longitude;
            if (manualLocationInput) manualLocationInput.classList.remove('hidden');
        },
        (error) => {
            console.error('Error getting location:', error);
            alert('Unable to get your location. Please enter coordinates manually.');
            if (manualLocationInput) manualLocationInput.classList.remove('hidden');
        }
    );
}

// Search nearby hotels
function searchNearbyHotels() {
    const lat = latInput ? latInput.value : null;
    const lng = lngInput ? lngInput.value : null;
    const radius = radiusSelect ? radiusSelect.value : 10;
    
    if (!lat || !lng) {
        alert('Please provide valid coordinates.');
        return;
    }
    
    // Close modal
    if (nearbyModal) nearbyModal.classList.add('hidden');
    
    // Update filters for nearby search
    currentFilters = {
        lat: lat,
        lng: lng,
        radius: radius
    };
    
    loadHotels(true);
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
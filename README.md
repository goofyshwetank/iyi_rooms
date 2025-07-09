# iYi Rooms - Premium Hotel Website

A stunning, premium, minimal website for iYi Rooms - a hotel chain and hospitality brand competing with OYO and Airbnb. This website showcases guest-viewable hotels using a public API while driving app downloads.

## 🚀 Features

### Design & UX
- **Premium Minimal Design**: Clean, modern interface with soft shadows and subtle gradients
- **Mobile-First Responsive**: Optimized for all devices with beautiful touch interactions
- **Dark/Light Theme**: Toggle between themes with persistent preference storage
- **Smooth Animations**: Fade-ins, slide-ups, and hover effects for enhanced UX
- **Loading Skeletons**: Professional loading states for better perceived performance

### Hotel Listings
- **Dynamic Hotel Grid**: Real-time hotel data from iYi Rooms API
- **Advanced Filtering**: Filter by city, price range, and ratings
- **Lazy Loading**: Optimized image loading for better performance
- **Pagination**: Load more hotels with infinite scroll capability
- **Hotel Cards**: Beautiful cards with images, ratings, prices, and "View on App" CTAs

### App Download Focus
- **Multiple CTAs**: Strategic placement of download buttons throughout the site
- **Sticky Banner**: Persistent bottom banner promoting app download
- **Play Store Integration**: Direct links to Google Play Store
- **App-Exclusive Messaging**: Clear communication that bookings are app-only

### Technical Features
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Performance Optimized**: Fast loading with minimal JavaScript
- **CORS Enabled**: Works with the public API without authentication
- **Error Handling**: Graceful error states and user feedback
- **Accessibility**: WCAG compliant with proper ARIA labels

## 🛠️ Technology Stack

- **HTML5**: Semantic markup with modern features
- **CSS3**: Custom properties, Flexbox, Grid, and animations
- **JavaScript (ES6+)**: Modern async/await, fetch API, and DOM manipulation
- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Font Awesome**: Icon library for consistent iconography
- **Google Fonts**: Inter font family for premium typography

## 📱 API Integration

The website integrates with the iYi Rooms Public API:

- **Base URL**: `https://admin.iyirooms.com/api/public`
- **Endpoints Used**:
  - `GET /hotels` - Fetch hotel listings with pagination and filtering
  - `GET /hotels/cities` - Get available cities for filtering
- **Features**:
  - No authentication required (public API)
  - CORS enabled for frontend integration
  - 30-minute server-side caching
  - Support for pagination, filtering, and sorting

## 🎨 Design System

### Colors
- **Primary**: `#f91376` (Brand Pink)
- **Secondary**: `#DB2777` (Dark Pink)
- **Accent**: `#FBCFE8` (Light Pink)
- **Background**: `#FFF1F2` (Extra Light Pink)

### Typography
- **Font Family**: Inter (300-900 weights)
- **Headings**: Bold, large, with brand color accents
- **Body**: Clean, readable text with proper hierarchy

### Components
- **Cards**: Rounded corners, soft shadows, hover effects
- **Buttons**: Gradient backgrounds, rounded, with hover animations
- **Forms**: Clean inputs with focus states and validation
- **Navigation**: Sticky header with backdrop blur

## 📁 File Structure

```
├── index.html          # Main website file
├── script.js           # JavaScript functionality
├── logo.png           # iYi Rooms logo
├── privacypolicy.html  # Privacy policy page
├── Public_api.md      # API documentation
└── README.md          # This file
```

## 🚀 Getting Started

1. **Clone or Download**: Get the website files
2. **Open in Browser**: Simply open `index.html` in a web browser
3. **No Build Required**: Pure HTML/CSS/JS - no compilation needed
4. **API Integration**: The website will automatically fetch hotel data

## 🎯 Key Sections

### 1. Hero Section
- Large, impactful headline
- Dual CTAs (Download App & Browse Hotels)
- Google Play Store badge
- Animated scroll indicator

### 2. Hotel Listings
- Dynamic grid of hotel cards
- Advanced filtering system
- Loading states and error handling
- "View on App" CTAs on each card

### 3. Testimonials
- Social proof with customer reviews
- Star ratings and customer photos
- Trust-building content

### 4. Features
- 6 key value propositions
- Icon-based design
- Hover animations

### 5. Sticky Download Banner
- Persistent app promotion
- Non-intrusive design
- Clear value proposition

## 🎨 Customization

### Colors
Update the CSS custom properties in the `<style>` section:
```css
:root {
    --brand-pink: #f91376;
    --brand-pink-dark: #DB2777;
    --brand-pink-light: #FBCFE8;
    --brand-pink-extralight: #FFF1F2;
}
```

### API Configuration
Modify the API base URL in `script.js`:
```javascript
const API_BASE_URL = 'https://admin.iyirooms.com/api/public';
```

### App Store Links
Update all Play Store links to point to your app:
```html
href="https://play.google.com/store/apps/details?id=io.iyirooms.app&pcampaignid=web_share"
```

## 📊 Performance Features

- **Lazy Loading**: Images load only when visible
- **Intersection Observer**: Efficient scroll-based animations
- **Minimal JavaScript**: Lightweight, fast execution
- **Optimized Images**: Proper sizing and compression
- **Caching**: Browser caching for static assets

## 🔧 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features Used**: CSS Grid, Flexbox, Custom Properties, Intersection Observer

## 📈 SEO Features

- **Meta Tags**: Title, description, keywords
- **Open Graph**: Social media sharing optimization
- **Structured Data**: JSON-LD for hotel information
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Alt Text**: Descriptive image alt attributes

## 🎯 Marketing Psychology

The website incorporates several UX psychology tactics:

1. **Trust Building**: Customer testimonials and ratings
2. **Social Proof**: Real reviews and user experiences
3. **Urgency**: Limited-time messaging and exclusive app features
4. **App Exclusivity**: Clear communication that bookings require the app
5. **Visual Hierarchy**: Strategic placement of CTAs and important information

## 📞 Support

For technical support or questions about the website:
- **Email**: support@iyirooms.com
- **Phone**: 90052 62576, 90052 31449

## 📄 License

This website is created for iYi Rooms. All rights reserved.

---

**Note**: This website is for promotional purposes. All bookings and services are managed exclusively through the iYi Rooms mobile app.
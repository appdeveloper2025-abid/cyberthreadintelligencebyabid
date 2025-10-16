# Cyber Threat Intelligence Visualizer

A static web application that visualizes cyber threats on an interactive world map with real-time data visualization and educational content.

## Features

- 🌍 **Interactive World Map** - Global threat visualization with severity-based markers
- 📊 **Real-time Charts** - Threat types and severity level analytics
- 🎨 **Dark Theme UI** - Modern, responsive design optimized for security professionals
- 📚 **Educational Glossary** - Comprehensive cyber attack explanations
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Quick Start

1. **Clone or download** the project files
2. **Open `index.html`** in a modern web browser
3. **Click "Refresh Data"** to load threat visualizations

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # Dark theme styling and responsive layout
├── script.js           # JavaScript for visualization and data handling
└── README.md           # This file
```

## API Integration

The application is designed to work with public threat intelligence APIs:

### Supported APIs
- **AbuseIPDB** - IP reputation and abuse reports
- **AlienVault OTX** - Open threat intelligence platform

### To Enable Real APIs:
1. Obtain API keys from the respective services
2. Uncomment the API methods in `script.js`
3. Replace `'YOUR_API_KEY'` with your actual API key
4. Modify the `loadMockData()` method to call real APIs

## Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with Grid and Flexbox
- **JavaScript ES6+** - Interactive functionality
- **Leaflet.js** - Interactive maps
- **Chart.js** - Data visualization
- **CartoDB** - Dark map tiles

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Note

This is a demonstration application using mock data. For production use:
- Implement proper API key management
- Add rate limiting for API calls
- Validate and sanitize all data inputs
- Use HTTPS for all API communications

## License

Open source - feel free to modify and distribute.
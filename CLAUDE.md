# Quilibrium Quorum Mandala Generator

## Project Overview
A web application for generating mandala visualizations based on Quorum account IDs.

## Development Commands
- Run development server: `python3 -m http.server 8000` (serves on http://localhost:8000)
- Alternative server: `python -m http.server 8000` (for Python 2.x)

## Tech Stack
- Vanilla JavaScript (no framework)
- HTML5 Canvas for mandala rendering
- CSS3 for styling
- PNG export functionality
- Web-based static application

## File Structure
- `index.html` - Main HTML entry point
- `components/avatar-creator.js` - Avatar creation component
- `assets/js/mandala-generator.js` - Core mandala generation logic
- `assets/js/png-export.js` - PNG export functionality
- `assets/js/utils.js` - Utility functions
- `assets/css/styles.css` - Main stylesheet
- `assets/fonts/nunito-900.woff2` - Nunito font file

## Notes
- Project uses Nunito 900 weight font with fallback for PNG export
- Static web application - no build process required
- Uses Python's built-in HTTP server for local development
- Dark theme UI implementation

---
*Updated: 2025-07-21 16:41*
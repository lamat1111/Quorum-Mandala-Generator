# Quorum Mandala Generator

Create unique mandalas from your Quorum IPFS user keys. Each key generates a mathematically deterministic mandala pattern with customizable color schemes.

## Features

- **Deterministic Generation**: Each IPFS key creates a unique, reproducible mandala
- **Mathematical Analysis**: Key properties determine element count, geometry type, and complexity
- **12 Color Schemes**: Beautiful, harmonious color palettes
- **Export Options**: Download as PNG (with transparent background) or SVG
- **Font Support**: Uses Nunito font with fallback to system fonts
- **Responsive Design**: Works on desktop and mobile devices

## Usage

1. Open `index.html` in a web browser
2. Enter your Quorum IPFS key (must start with 'Qm' and be 46 characters)
3. Choose your preferred color scheme
4. Optionally add "QM" text overlay
5. Download as PNG or SVG

## File Structure

```
quorum-mandala-generator/
├── index.html              # Main entry point
├── assets/
│   ├── fonts/
│   │   └── nunito-900.woff2 # Nunito font file
│   ├── css/
│   │   └── styles.css       # All styling
│   └── js/
│       ├── utils.js         # Utility functions and constants
│       ├── mandala-generator.js # Core mandala generation logic
│       └── png-export.js    # Export functionality
├── components/
│   └── avatar-creator.js    # Main React component
└── README.md               # This file
```

## Technical Details

### Mandala Generation

The mandala generation process analyzes your IPFS key in segments:

1. **Element Count**: 3-16 elements based on key analysis
2. **Geometry Type**: Straight, curved, or mixed shapes
3. **Complexity Level**: Simple, detailed, or complex patterns
4. **Symmetry Factor**: Rotation and positioning variations
5. **Layer Count**: Multiple layers for complex patterns

### Export Functionality

- **PNG Export**: Creates 500x500px PNG with circular clipping and transparency
- **SVG Export**: Scalable vector format, copied to clipboard for manual saving
- **Font Handling**: Attempts Nunito font first, falls back to Arial if needed

### Browser Compatibility

- Modern browsers with ES6+ support
- React 18 for component rendering
- Canvas API for PNG generation
- SVG support for vector graphics

## Development

The project uses:
- **React 18** (via CDN for simplicity)
- **Babel** for JSX transformation
- **Custom CSS** (no framework dependencies)
- **Modular JavaScript** for maintainability

To modify:
1. Edit components in respective files
2. Update styles in `assets/css/styles.css`
3. Refresh browser to see changes

## Font Issues Resolution

The previous version had font loading issues due to:
- External CDN dependencies
- Embedded base64 fonts causing parsing errors
- Complex fallback logic

**Current solution**:
- Self-hosted Nunito font file
- Proper `@font-face` declarations
- Reliable fallback chain
- Font preloading for performance

## Color Schemes

Available color schemes:
- Emerald Forest, Deep Ocean, Sapphire
- Cosmic Nebula, Galaxy, Coral Reef
- Monochrome, Crimson Fire, Rose Gold
- Golden Sunset, Jade Garden, Autumn Leaves

Each scheme includes background gradients and accent colors optimized for mandala visibility.

---

*Generated with mathematical precision from your unique Quorum identity.*
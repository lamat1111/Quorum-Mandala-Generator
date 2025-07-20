// Use utilities directly from window to avoid redeclaration

// Icon components
const Download = ({ size = 20 }) => React.createElement('svg', {
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2
}, 
  React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
  React.createElement('polyline', { points: '7,10 12,15 17,10' }),
  React.createElement('line', { x1: 12, y1: 15, x2: 12, y2: 3 })
);

const Sparkles = ({ size = 20 }) => React.createElement('svg', {
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2
}, 
  React.createElement('path', { d: 'm12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' }),
  React.createElement('path', { d: 'M5 3v4' }),
  React.createElement('path', { d: 'M19 17v4' }),
  React.createElement('path', { d: 'M3 5h4' }),
  React.createElement('path', { d: 'M17 19h4' })
);

// Checkbox component
const Checkbox = ({ id, checked, onChange, label, centered = false }) => {
  return React.createElement('div', { className: `checkbox-container ${centered ? 'centered' : ''}` },
    React.createElement('div', { className: 'checkbox' },
      React.createElement('input', {
        type: 'checkbox',
        id: id,
        checked: checked,
        onChange: onChange
      }),
      React.createElement('label', { htmlFor: id },
        checked && React.createElement('svg', {
          className: 'checkbox-icon',
          fill: 'currentColor',
          viewBox: '0 0 20 20'
        },
          React.createElement('path', {
            fillRule: 'evenodd',
            d: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
            clipRule: 'evenodd'
          })
        )
      )
    ),
    React.createElement('label', {
      htmlFor: id,
      className: 'checkbox-label'
    }, label)
  );
};

// Main Avatar Creator Component
function AvatarCreator() {
  const [userKey, setUserKey] = React.useState("");
  const [selectedColorScheme, setSelectedColorScheme] = React.useState(0);
  const [showQM, setShowQM] = React.useState(false);
  const [downloadSVG, setDownloadSVG] = React.useState(false);

  // Update color scheme when key changes
  React.useEffect(() => {
    if (window.MandalaUtils.isValidIPFSHash(userKey)) {
      const keyHash = window.MandalaUtils.hashSegment(userKey.slice(2, 13));
      const defaultSchemeIndex = keyHash % window.MandalaUtils.AESTHETIC_SCHEMES.length;
      setSelectedColorScheme(defaultSchemeIndex);
    }
  }, [userKey]);

  const handleExport = async () => {
    if (!window.MandalaUtils.isValidIPFSHash(userKey)) return;
    
    try {
      // Find the main mandala SVG
      const svgElement = document.querySelector('.mandala-preview svg');
      if (!svgElement) {
        alert('Could not find mandala to export');
        return;
      }

      if (downloadSVG) {
        await window.ExportUtils.exportSVG(svgElement);
      } else {
        await window.ExportUtils.exportPNG(svgElement);
      }
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const isValidKey = window.MandalaUtils.isValidIPFSHash(userKey);
  const selectedScheme = window.MandalaUtils.AESTHETIC_SCHEMES[selectedColorScheme];

  return React.createElement('div', { className: 'app-container' },
    // Header
    React.createElement('div', { className: 'header' },
      React.createElement('h1', {},
        React.createElement(Sparkles, {}),
        "Quorum Mandala Generator"
      ),
      React.createElement('p', {}, 
        "Create unique mandalas from your Quorum user key"
      ),
      
      // Input Section
      React.createElement('div', { className: 'input-section' },
        React.createElement('p', {}, 
          "Enter Your Quorum Key (must start with 'Qm' and be 46 characters):"
        ),
        React.createElement('input', {
          type: "text",
          value: userKey,
          onChange: (e) => setUserKey(e.target.value),
          placeholder: "QmX7R9K2mPqWvYzN3jL8tE6FpA4sQ1cV5bM9xH2uD8wG3",
          className: `input-field ${
            userKey && !isValidKey 
              ? 'invalid' 
              : userKey && isValidKey
              ? 'valid'
              : ''
          }`
        }),
        
        userKey && !isValidKey && React.createElement('p', {
          className: 'error-message'
        }, "Invalid IPFS key format. Must start with 'Qm' and be exactly 46 characters."),
        
        React.createElement(Checkbox, {
          id: "showQM",
          checked: showQM,
          onChange: (e) => setShowQM(e.target.checked),
          label: 'Add "QM"'
        })
      )
    ),

    // Main Content Area
    React.createElement('div', { className: 'main-content' },
      // Mandala and Controls Section (Same container, 2 columns on desktop)
      React.createElement('div', { className: 'mandala-section' },
        React.createElement('h3', {}, "Your Quorum Mandala"),
        
        React.createElement('div', { className: 'mandala-controls-grid' },
          // Mandala Preview (Left column on desktop)
          React.createElement('div', { className: 'mandala-preview' },
            isValidKey ? React.createElement('div', {},
              window.MandalaGenerator.generateMandalaAvatar(userKey, selectedScheme, 300, showQM),
              React.createElement('div', { className: 'mandala-overlay' })
            ) : React.createElement('div', { className: 'mandala-placeholder' },
              React.createElement(Sparkles, { size: 48 })
            )
          ),
          
          // Controls (Right column on desktop, below on mobile)
          React.createElement('div', { className: 'controls-section' },
            React.createElement('button', {
              onClick: handleExport,
              disabled: !isValidKey,
              className: 'download-btn'
            },
              React.createElement(Download, { size: 20 }),
              "Download Quorum Mandala"
            ),
            
            React.createElement(Checkbox, {
              id: "downloadSVG",
              checked: downloadSVG,
              onChange: (e) => setDownloadSVG(e.target.checked),
              label: "Download as SVG (instead of PNG)",
              centered: false
            }),
            
            isValidKey && React.createElement('div', { className: 'separator' }),
            
            isValidKey && React.createElement('div', { className: 'info-panel' },
              React.createElement('div', {}, 
                "Color Scheme: ",
                React.createElement('strong', {}, selectedScheme.name)
              ),
              React.createElement('div', {}, 
                "Pattern: ",
                React.createElement('strong', {}, window.MandalaUtils.getMandalaDescription(userKey))
              ),
              React.createElement('div', {}, 
                "Source: ",
                React.createElement('strong', {}, `${userKey.slice(0, 8)}...`)
              )
            )
          )
        )
      ),

      // Color Scheme Section (Bottom) - Only visible when mandala is displayed
      isValidKey && React.createElement('div', { className: 'mandala-section' },
        React.createElement('div', { style: { marginBottom: '1.5rem' } },
          React.createElement('h3', { style: { marginBottom: '2.5rem' } }, 
            "Choose Your Color Scheme"
          )
        ),
        
        React.createElement('div', { className: 'color-grid' },
          window.MandalaUtils.AESTHETIC_SCHEMES.map((scheme, index) =>
            React.createElement('button', {
              key: `color-${index}`,
              onClick: () => setSelectedColorScheme(index),
              className: `color-option ${selectedColorScheme === index ? 'selected' : ''}`
            },
              React.createElement('div', { className: 'color-preview' },
                window.MandalaGenerator.generateMandalaAvatar(userKey, scheme, 80, showQM)
              ),
              React.createElement('p', { className: 'color-name' }, scheme.name)
            )
          )
        ),
        
        React.createElement('div', { className: 'info-box' },
          React.createElement('p', {},
            "🔮 Mathematical Generation: Your Quorum IPFS key is analyzed to determine element count (3-16), geometry type (straight/curved/mixed), complexity level, and positioning. Each unique key creates a different mandala structure."
          )
        )
      )
    )
  );
}

// Export for global use
if (typeof window !== 'undefined') {
  window.AvatarCreator = AvatarCreator;
}
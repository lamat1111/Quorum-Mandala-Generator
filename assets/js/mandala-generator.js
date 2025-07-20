// Use utilities directly from window to avoid redeclaration

// Helper function to create SVG with consistent styling
const createSVG = (size, colorScheme, elements, userKey) => {
  const gradientId = `mandala-grad-${userKey.slice(-8)}-${colorScheme.name.replace(/\s+/g, '')}`;
  
  return React.createElement('svg', {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    className: "mandala rounded-full"
  },
    React.createElement('defs', {},
      React.createElement('radialGradient', {
        id: gradientId,
        cx: "50%",
        cy: "50%",
        r: "50%"
      },
        React.createElement('stop', { offset: "0%", stopColor: colorScheme.bg1 }),
        React.createElement('stop', { offset: "100%", stopColor: colorScheme.bg2 })
      )
    ),
    React.createElement('circle', {
      cx: size/2,
      cy: size/2,
      r: size/2,
      fill: `url(#${gradientId})`
    }),
    ...elements
  );
};

// Generate individual elements based on mathematical parameters
const generateElement = (x, y, size, angle, index, geometryType, complexityLevel, variation, colorScheme, totalElements) => {
  const key = `element-${index}-${Math.floor(x)}-${Math.floor(y)}`;
  
  switch (geometryType) {
    case 0: // Straight geometry
      return generateStraightElement(x, y, size, angle, index, complexityLevel, variation, colorScheme, key);
    case 1: // Curved geometry  
      return generateCurvedElement(x, y, size, angle, index, complexityLevel, variation, colorScheme, key);
    case 2: // Mixed geometry
      return index % 2 === 0 
        ? generateStraightElement(x, y, size, angle, index, complexityLevel, variation, colorScheme, key)
        : generateCurvedElement(x, y, size, angle, index, complexityLevel, variation, colorScheme, key);
    default:
      return generateStraightElement(x, y, size, angle, index, complexityLevel, variation, colorScheme, key);
  }
};

// Generate straight-line elements
const generateStraightElement = (x, y, size, angle, index, complexity, variation, colorScheme, key) => {
  const color = index % 2 === 0 ? colorScheme.accent1 : colorScheme.accent2;
  const strokeColor = colorScheme.accent3;
  
  switch (complexity) {
    case 0: // Simple shapes
      if (variation % 3 === 0) {
        // Triangle
        const points = [
          `${x},${y - size/2}`,
          `${x + size/2 * Math.cos(Math.PI/6)},${y + size/2 * Math.sin(Math.PI/6)}`,
          `${x - size/2 * Math.cos(Math.PI/6)},${y + size/2 * Math.sin(Math.PI/6)}`
        ];
        return React.createElement('polygon', {
          key: key,
          points: points.join(' '),
          fill: color,
          stroke: strokeColor,
          strokeWidth: "2",
          opacity: 0.9,
          transform: `rotate(${angle * 180 / Math.PI} ${x} ${y})`
        });
      } else if (variation % 3 === 1) {
        // Diamond
        const points = [
          `${x},${y - size/2}`,
          `${x + size/3},${y}`,
          `${x},${y + size/2}`,
          `${x - size/3},${y}`
        ];
        return React.createElement('polygon', {
          key: key,
          points: points.join(' '),
          fill: color,
          stroke: strokeColor,
          strokeWidth: "2",
          opacity: 0.9,
          transform: `rotate(${angle * 180 / Math.PI} ${x} ${y})`
        });
      } else {
        // Rectangle
        return React.createElement('rect', {
          key: key,
          x: x - size/4,
          y: y - size/2,
          width: size/2,
          height: size,
          fill: color,
          stroke: strokeColor,
          strokeWidth: "2",
          opacity: 0.9,
          transform: `rotate(${angle * 180 / Math.PI} ${x} ${y})`
        });
      }
      
    case 1: // Medium complexity
      // Star shape
      const starPoints = [];
      const spikes = 5 + (variation % 3);
      for (let i = 0; i < spikes * 2; i++) {
        const starAngle = (i * Math.PI) / spikes;
        const radius = i % 2 === 0 ? size/2 : size/4;
        starPoints.push(`${x + radius * Math.cos(starAngle)},${y + radius * Math.sin(starAngle)}`);
      }
      return React.createElement('polygon', {
        key: key,
        points: starPoints.join(' '),
        fill: color,
        stroke: strokeColor,
        strokeWidth: "2",
        opacity: 0.9,
        transform: `rotate(${angle * 180 / Math.PI} ${x} ${y})`
      });
      
    case 2: // Complex
      // Multiple layered shapes
      const elements = [];
      for (let layer = 0; layer < 3; layer++) {
        const layerSize = size * (1 - layer * 0.2);
        const layerColor = layer === 0 ? color : strokeColor;
        const opacity = 0.9 - layer * 0.2;
        
        if (variation % 2 === 0) {
          // Layered hexagons
          const hexPoints = [];
          for (let i = 0; i < 6; i++) {
            const hexAngle = (i * 60) * Math.PI / 180;
            hexPoints.push(`${x + layerSize/2 * Math.cos(hexAngle)},${y + layerSize/2 * Math.sin(hexAngle)}`);
          }
          elements.push(
            React.createElement('polygon', {
              key: `${key}-hex-${layer}`,
              points: hexPoints.join(' '),
              fill: layer === 2 ? layerColor : 'none',
              stroke: layerColor,
              strokeWidth: "2",
              opacity: opacity,
              transform: `rotate(${angle * 180 / Math.PI + layer * 30} ${x} ${y})`
            })
          );
        } else {
          // Layered squares
          elements.push(
            React.createElement('rect', {
              key: `${key}-rect-${layer}`,
              x: x - layerSize/4,
              y: y - layerSize/4,
              width: layerSize/2,
              height: layerSize/2,
              fill: layer === 2 ? layerColor : 'none',
              stroke: layerColor,
              strokeWidth: "2",
              opacity: opacity,
              transform: `rotate(${angle * 180 / Math.PI + layer * 45} ${x} ${y})`
            })
          );
        }
      }
      return React.createElement('g', { key: key }, ...elements);
      
    default:
      return null;
  }
};

// Generate curved elements
const generateCurvedElement = (x, y, size, angle, index, complexity, variation, colorScheme, key) => {
  const color = index % 2 === 0 ? colorScheme.accent1 : colorScheme.accent2;
  const strokeColor = colorScheme.accent3;
  
  switch (complexity) {
    case 0: // Simple curves
      if (variation % 2 === 0) {
        // Simple petal
        const petalPath = `M${x},${y} Q${x + size/3},${y - size/2} ${x + size/2},${y} Q${x + size/3},${y + size/2} ${x},${y}Z`;
        return React.createElement('path', {
          key: key,
          d: petalPath,
          fill: color,
          stroke: strokeColor,
          strokeWidth: "2",
          opacity: 0.9,
          transform: `rotate(${angle * 180 / Math.PI} ${x} ${y})`
        });
      } else {
        // Leaf shape
        const leafPath = `M${x},${y} Q${x - size/4},${y - size/2} ${x},${y - size} Q${x + size/4},${y - size/2} ${x},${y}Z`;
        return React.createElement('path', {
          key: key,
          d: leafPath,
          fill: color,
          stroke: strokeColor,
          strokeWidth: "2",
          opacity: 0.9,
          transform: `rotate(${angle * 180 / Math.PI} ${x} ${y})`
        });
      }
      
    case 1: // Medium curves
      // Heart-like shape
      const heartPath = `M${x},${y} Q${x - size/4},${y - size/3} ${x - size/2},${y - size/6} Q${x - size/2},${y + size/6} ${x},${y + size/2} Q${x + size/2},${y + size/6} ${x + size/2},${y - size/6} Q${x + size/4},${y - size/3} ${x},${y}Z`;
      return React.createElement('path', {
        key: key,
        d: heartPath,
        fill: color,
        stroke: strokeColor,
        strokeWidth: "2",
        opacity: 0.9,
        transform: `rotate(${angle * 180 / Math.PI} ${x} ${y})`
      });
      
    case 2: // Complex curves
      // Multi-curve flower
      const curves = [];
      const petalCount = 3 + (variation % 4);
      for (let p = 0; p < petalCount; p++) {
        const petalAngle = (p * 360 / petalCount) * Math.PI / 180;
        const petalPath = `M${x},${y} Q${x + size/3 * Math.cos(petalAngle + 0.5)},${y + size/3 * Math.sin(petalAngle + 0.5)} ${x + size/2 * Math.cos(petalAngle)},${y + size/2 * Math.sin(petalAngle)} Q${x + size/3 * Math.cos(petalAngle - 0.5)},${y + size/3 * Math.sin(petalAngle - 0.5)} ${x},${y}`;
        curves.push(
          React.createElement('path', {
            key: `${key}-petal-${p}`,
            d: petalPath,
            fill: p % 2 === 0 ? color : strokeColor,
            stroke: strokeColor,
            strokeWidth: "1",
            opacity: 0.8,
            transform: `rotate(${angle * 180 / Math.PI} ${x} ${y})`
          })
        );
      }
      return React.createElement('g', { key: key }, ...curves);
      
    default:
      return null;
  }
};

// Generate center element
const generateCenterElement = (x, y, size, variation, colorScheme) => {
  switch (variation % 4) {
    case 0:
      return React.createElement('circle', {
        key: "center",
        cx: x,
        cy: y,
        r: size,
        fill: colorScheme.accent3,
        stroke: colorScheme.accent1,
        strokeWidth: "3",
        opacity: 1
      });
      
    case 1:
      const starPoints = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        const radius = i % 2 === 0 ? size : size * 0.5;
        starPoints.push(`${x + radius * Math.cos(angle)},${y + radius * Math.sin(angle)}`);
      }
      return React.createElement('polygon', {
        key: "center",
        points: starPoints.join(' '),
        fill: colorScheme.accent3,
        stroke: colorScheme.accent1,
        strokeWidth: "2",
        opacity: 1
      });
      
    case 2:
      const hexPoints = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * Math.PI / 180;
        hexPoints.push(`${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`);
      }
      return React.createElement('polygon', {
        key: "center",
        points: hexPoints.join(' '),
        fill: colorScheme.accent3,
        stroke: colorScheme.accent1,
        strokeWidth: "2",
        opacity: 1
      });
      
    case 3:
      return React.createElement('g', { key: "center" },
        React.createElement('circle', {
          cx: x,
          cy: y,
          r: size,
          fill: "none",
          stroke: colorScheme.accent1,
          strokeWidth: "3",
          opacity: 1
        }),
        React.createElement('circle', {
          cx: x,
          cy: y,
          r: size * 0.5,
          fill: colorScheme.accent3,
          opacity: 1
        })
      );
      
    default:
      return null;
  }
};

// Generate complex mandala based on mathematical analysis of IPFS key
const generateMandalaAvatar = (userKey, colorScheme, size = 120, showQM = false) => {
  if (!window.MandalaUtils.isValidIPFSHash(userKey)) return null;
  
  const analysis = window.MandalaUtils.analyzeIPFSKey(userKey);
  const rng = new window.MandalaUtils.AestheticRandom(userKey);
  
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size * 0.4;
  const elements = [];
  
  // Generate elements based on key analysis
  for (let i = 0; i < analysis.elementCount; i++) {
    const angle = (i * 360 / analysis.elementCount + analysis.symmetryFactor) * Math.PI / 180;
    
    // Size varies based on key properties
    const elementSize = maxRadius * (0.6 + analysis.sizeVariation * 0.4) * (0.8 + 0.4 * Math.sin(i * 0.7));
    
    // Position elements
    const elementDistance = maxRadius * (0.7 + 0.3 * Math.sin(i * 1.2));
    const elementX = centerX + elementDistance * Math.cos(angle);
    const elementY = centerY + elementDistance * Math.sin(angle);
    
    // Generate element based on geometry type and complexity
    const element = generateElement(
      elementX, elementY, elementSize, angle, i,
      analysis.geometryType, 
      analysis.complexityLevel,
      analysis.patternVariation,
      colorScheme,
      analysis.elementCount
    );
    
    if (element) {
      elements.push(element);
    }
  }
  
  // Add layers for complex patterns
  if (analysis.complexityLevel >= 1 && analysis.layerCount > 1) {
    for (let layer = 1; layer < analysis.layerCount; layer++) {
      const layerRadius = maxRadius * (0.4 + layer * 0.2);
      const layerElements = Math.max(3, Math.floor(analysis.elementCount / (layer + 1)));
      
      for (let i = 0; i < layerElements; i++) {
        const angle = (i * 360 / layerElements + analysis.symmetryFactor + layer * 45) * Math.PI / 180;
        const elementX = centerX + layerRadius * Math.cos(angle);
        const elementY = centerY + layerRadius * Math.sin(angle);
        
        const layerElement = generateElement(
          elementX, elementY, maxRadius * 0.15, angle, i,
          (analysis.geometryType + layer) % 3,
          0, // Simpler for inner layers
          analysis.patternVariation,
          colorScheme,
          layerElements
        );
        
        if (layerElement) {
          elements.push(layerElement);
        }
      }
    }
  }
  
  // Generate center element based on key (only if QM text is not shown)
  if (!showQM) {
    const centerElement = generateCenterElement(
      centerX, centerY, maxRadius * 0.15, 
      analysis.patternVariation, colorScheme
    );
    
    if (centerElement) {
      elements.push(centerElement);
    }
  }
  
  // Add QM text if requested
  if (showQM) {
    const textSize = size * 0.4;
    const shadowId = `qm-shadow-${userKey.slice(-4)}`;
    
    elements.push(
      React.createElement('g', { key: "qm-text-group" },
        React.createElement('defs', {},
          React.createElement('filter', {
            id: shadowId,
            x: "-50%",
            y: "-50%",
            width: "200%",
            height: "200%"
          },
            React.createElement('feDropShadow', {
              dx: "4",
              dy: "8",
              stdDeviation: "6",
              floodColor: "rgba(0,0,0,0.7)"
            })
          )
        ),
        React.createElement('text', {
          x: centerX,
          y: centerY + textSize * 0.15,
          textAnchor: "middle",
          dominantBaseline: "middle",
          fontSize: textSize,
          fontFamily: "'Nunito', Arial, sans-serif",
          fontWeight: "700",
          fill: colorScheme.accent1,
          filter: `url(#${shadowId})`,
          opacity: 1,
          className: "qm-text",
          style: { 
            fontFeatureSettings: '"rlig" 1, "calt" 1',
            letterSpacing: '0.1em'
          }
        }, "QM")
      )
    );
  }
  
  return createSVG(size, colorScheme, elements, userKey);
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.MandalaGenerator = {
    generateMandalaAvatar,
    createSVG,
    generateElement,
    generateStraightElement,
    generateCurvedElement,
    generateCenterElement
  };
}
// Advanced deterministic random generator
class AestheticRandom {
  constructor(seed) {
    this.seed = this.hashString(seed);
  }
  
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  range(min, max) {
    return min + this.next() * (max - min);
  }
  
  choice(array) {
    return array[Math.floor(this.next() * array.length)];
  }
}

// Validate IPFS hash format
const isValidIPFSHash = (key) => {
  const base58Regex = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
  return key.startsWith('Qm') && key.length === 46 && base58Regex.test(key);
};

// Beautiful, harmonious color schemes
const AESTHETIC_SCHEMES = [
  { name: 'Emerald Forest', bg1: '#064E3B', bg2: '#059669', accent1: '#FFFFFF', accent2: '#D1FAE5', accent3: '#6EE7B7' },
  { name: 'Deep Ocean', bg1: '#1E3A8A', bg2: '#3B82F6', accent1: '#FFFFFF', accent2: '#DBEAFE', accent3: '#93C5FD' },
  { name: 'Sapphire', bg1: '#1E40AF', bg2: '#2563EB', accent1: '#FFFFFF', accent2: '#DBEAFE', accent3: '#60A5FA' },
  { name: 'Cosmic Nebula', bg1: '#581C87', bg2: '#A855F7', accent1: '#FFFFFF', accent2: '#F3E8FF', accent3: '#C084FC' },
  { name: 'Galaxy', bg1: '#4C1D95', bg2: '#7C3AED', accent1: '#FFFFFF', accent2: '#EDE9FE', accent3: '#A78BFA' },
  { name: 'Coral Reef', bg1: '#0F766E', bg2: '#14B8A6', accent1: '#FFFFFF', accent2: '#CCFBF1', accent3: '#5EEAD4' },
  { name: 'Monochrome', bg1: '#111827', bg2: '#6B7280', accent1: '#FFFFFF', accent2: '#F3F4F6', accent3: '#D1D5DB' },
  { name: 'Crimson Fire', bg1: '#7F1D1D', bg2: '#DC2626', accent1: '#FFFFFF', accent2: '#FEE2E2', accent3: '#F87171' },
  { name: 'Rose Gold', bg1: '#BE185D', bg2: '#EC4899', accent1: '#FFFFFF', accent2: '#FCE7F3', accent3: '#F472B6' },
  { name: 'Golden Sunset', bg1: '#EA580C', bg2: '#FB923C', accent1: '#FFFFFF', accent2: '#FED7AA', accent3: '#FDBA74' },
  { name: 'Jade Garden', bg1: '#14532D', bg2: '#16A34A', accent1: '#FFFFFF', accent2: '#DCFCE7', accent3: '#4ADE80' },
  { name: 'Autumn Leaves', bg1: '#C2410C', bg2: '#F97316', accent1: '#FFFFFF', accent2: '#FFEDD5', accent3: '#FB923C' }
];

// Extract mathematical properties from IPFS key
const analyzeIPFSKey = (userKey) => {
  const keyWithoutPrefix = userKey.slice(2); // Remove "Qm"
  
  // Convert key segments to numbers for mathematical analysis
  const segment1 = keyWithoutPrefix.slice(0, 11);
  const segment2 = keyWithoutPrefix.slice(11, 22);
  const segment3 = keyWithoutPrefix.slice(22, 33);
  const segment4 = keyWithoutPrefix.slice(33, 44);
  
  const hash1 = hashSegment(segment1);
  const hash2 = hashSegment(segment2);
  const hash3 = hashSegment(segment3);
  const hash4 = hashSegment(segment4);
  
  return {
    // Element count (3-16 elements)
    elementCount: 3 + (hash1 % 14),
    
    // Geometry type (0=straight, 1=curved, 2=mixed)
    geometryType: hash2 % 3,
    
    // Complexity level (0=simple, 1=medium, 2=complex)
    complexityLevel: hash3 % 3,
    
    // Pattern variation (affects specific shape details)
    patternVariation: hash4 % 8,
    
    // Symmetry factor (affects rotation and positioning)
    symmetryFactor: (hash1 + hash2) % 360,
    
    // Size variation factor
    sizeVariation: (hash3 + hash4) % 100 / 100,
    
    // Layer count for complex patterns
    layerCount: 1 + ((hash1 + hash3) % 4)
  };
};

const hashSegment = (segment) => {
  let hash = 0;
  for (let i = 0; i < segment.length; i++) {
    hash = ((hash << 5) - hash) + segment.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Generate description based on key analysis
const getMandalaDescription = (userKey) => {
  if (!isValidIPFSHash(userKey)) return "Enter a valid IPFS key";
  
  const analysis = analyzeIPFSKey(userKey);
  const geometryTypes = ["Geometric", "Curved", "Mixed"];
  const complexityLevels = ["Simple", "Detailed", "Complex"];
  
  return `${analysis.elementCount} ${geometryTypes[analysis.geometryType]} ${complexityLevels[analysis.complexityLevel]} Elements`;
};

// Wait for font to load with timeout
const waitForFont = async (fontFamily = 'Nunito', timeout = 3000) => {
  if (!document.fonts || !document.fonts.load) {
    return false;
  }
  
  try {
    await Promise.race([
      document.fonts.load(`900 16px ${fontFamily}`),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Font load timeout')), timeout))
    ]);
    await document.fonts.ready;
    return true;
  } catch (error) {
    console.warn(`Font ${fontFamily} failed to load:`, error);
    return false;
  }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.MandalaUtils = {
    AestheticRandom,
    isValidIPFSHash,
    AESTHETIC_SCHEMES,
    analyzeIPFSKey,
    hashSegment,
    getMandalaDescription,
    waitForFont
  };
}
// Use utilities directly from window to avoid redeclaration

// PNG Export functionality
class PNGExporter {
  constructor() {
    this.modal = null;
  }

  async exportMandala(svgElement, filename = 'quorum-mandala.png') {
    if (!svgElement) {
      this.showError('Could not find mandala to export');
      return;
    }

    this.createModal();
    
    try {
      // Try with Nunito font first
      const success = await this.convertToPNG(svgElement, true, filename);
      if (!success) {
        // Fallback to system font
        await this.convertToPNG(svgElement, false, filename);
      }
    } catch (error) {
      console.error('Export failed:', error);
      this.showError('Export failed. Please try again.');
    }
  }

  async convertToPNG(svgElement, useNunitoFont = true, filename) {
    try {
      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true);
      
      // Set explicit dimensions
      svgClone.setAttribute('width', '500');
      svgClone.setAttribute('height', '500');
      
      // Get the SVG string
      let svgString = new XMLSerializer().serializeToString(svgClone);
      
      if (useNunitoFont) {
        // Wait for font to be ready
        const fontLoaded = await window.MandalaUtils.waitForFont('Nunito', 3000);
        
        if (fontLoaded) {
          // Embed the font as base64 data URL for reliable PNG rendering
          try {
            const fontResponse = await fetch('./assets/fonts/nunito-900.woff2');
            
            if (fontResponse.ok) {
              const fontBuffer = await fontResponse.arrayBuffer();
              const base64Font = btoa(String.fromCharCode(...new Uint8Array(fontBuffer)));
              
              // Embed the font as base64 data URL
              const fontFace = `
                <defs>
                  <style type="text/css"><![CDATA[
                    @font-face {
                      font-family: 'NunitoPNG';
                      font-style: normal;
                      font-weight: 700;
                      font-display: swap;
                      src: url('data:font/woff2;base64,${base64Font}') format('woff2');
                    }
                  ]]></style>
                </defs>
              `;
              
              // Insert font definition after opening SVG tag
              svgString = svgString.replace('<svg', `<svg${svgString.includes('xmlns') ? '' : ' xmlns="http://www.w3.org/2000/svg"'}`);
              svgString = svgString.replace(/(<svg[^>]*>)/, `$1${fontFace}`);
            } else {
              throw new Error('Font file not accessible');
            }
          } catch (fontError) {
            // Fallback to font reference
            const fontFace = `
              <defs>
                <style type="text/css"><![CDATA[
                  @font-face {
                    font-family: 'NunitoPNG';
                    font-style: normal;
                    font-weight: 700;
                    font-display: swap;
                    src: url('./assets/fonts/nunito-900.woff2') format('woff2');
                  }
                ]]></style>
              </defs>
            `;
            
            // Insert font definition after opening SVG tag
            svgString = svgString.replace('<svg', `<svg${svgString.includes('xmlns') ? '' : ' xmlns="http://www.w3.org/2000/svg"'}`);
            svgString = svgString.replace(/(<svg[^>]*>)/, `$1${fontFace}`);
          }
          
          // Replace font references
          svgString = svgString.replace(
            /font-family="[^"]*"/g, 
            'font-family="NunitoPNG, Nunito, -apple-system, BlinkMacSystemFont, Arial, sans-serif"'
          );
          svgString = svgString.replace(/font-weight="600"/g, 'font-weight="600"');
        } else {
          // Font failed to load, use fallback
          return await this.convertToPNG(svgElement, false, filename);
        }
      } else {
        // Use fallback fonts with bold weight
        svgString = svgString.replace(
          /font-family="[^"]*"/g, 
          'font-family="Arial Black, Arial, Helvetica, sans-serif"'
        );
        svgString = svgString.replace(/font-weight="600"/g, 'font-weight="bold"');
      }
      
      // Ensure proper SVG namespace and encoding
      if (!svgString.includes('xmlns')) {
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      
      // Add XML declaration for better compatibility
      svgString = '<?xml version="1.0" encoding="UTF-8"?>' + svgString;
      
      // Convert directly to canvas without intermediate image
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      
      // Create SVG blob with proper MIME type
      const svgBlob = new Blob([svgString], { 
        type: 'image/svg+xml;charset=utf-8' 
      });
      const url = URL.createObjectURL(svgBlob);
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          try {
            // Clear canvas
            ctx.clearRect(0, 0, 500, 500);
            
            // Create circular clipping mask
            ctx.save();
            ctx.beginPath();
            ctx.arc(250, 250, 250, 0, 2 * Math.PI);
            ctx.clip();
            
            // Draw the mandala
            ctx.drawImage(img, 0, 0, 500, 500);
            ctx.restore();
            
            // Convert to PNG blob
            canvas.toBlob((blob) => {
              URL.revokeObjectURL(url);
              if (blob) {
                this.showSuccessModal(blob, filename, useNunitoFont);
                resolve(true);
              } else {
                reject(new Error('Failed to create PNG blob'));
              }
            }, 'image/png');
            
          } catch (drawError) {
            URL.revokeObjectURL(url);
            reject(drawError);
          }
        };
        
        img.onerror = (error) => {
          URL.revokeObjectURL(url);
          console.error('PNG export failed - SVG could not be loaded as image');
          reject(error);
        };
        
        // Set crossOrigin before src
        img.crossOrigin = 'anonymous';
        img.src = url;
      });
      
    } catch (error) {
      console.error('PNG conversion error:', error);
      if (useNunitoFont) {
        // Try fallback font
        return await this.convertToPNG(svgElement, false, filename);
      } else {
        // Both attempts failed
        this.showError('Unable to convert mandala to PNG format. Please try the SVG export option.');
        return false;
      }
    }
  }


  createModal() {
    this.modal = document.createElement('div');
    this.modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
      background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
      align-items: center; justify-content: center; font-family: system-ui;
    `;
    document.body.appendChild(this.modal);
    
    // Click outside to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });
  }

  showSuccessModal(blob, filename, usedNunitoFont) {
    const url = URL.createObjectURL(blob);
    const fontNote = usedNunitoFont ? '' : 
      '<p style="margin: 10px 0; color: #fbbf24; font-size: 13px;">Note: Using fallback font due to Nunito loading issues.</p>';
    
    this.modal.innerHTML = `
      <div style="
        background: rgba(29, 26, 33, 0.95); 
        backdrop-filter: blur(10px);
        padding: 30px; 
        border-radius: 15px; 
        box-shadow: 0 20px 40px rgba(0,0,0,0.5); 
        max-width: 500px; 
        text-align: center;
        border: 1px solid rgba(60, 55, 68, 0.4);
      ">
        <h3 style="margin: 0 0 15px 0; color: #0287f2; font-size: 20px;">🖼️ PNG Ready!</h3>
        <p style="margin: 0 0 20px 0; color: #b0b0b0; line-height: 1.5;">
          Your mandala PNG with transparent background is ready for download.
        </p>
        ${fontNote}
        <div style="
          margin: 0 0 20px 0; 
          border: 2px dashed rgba(60, 55, 68, 0.6); 
          border-radius: 10px; 
          padding: 20px; 
          background: rgba(15, 13, 19, 0.8);
        ">
          <img src="${url}" style="
            width: 400px; 
            height: 400px; 
            border-radius: 50%; 
            display: block; 
            margin: 0 auto;
          " alt="Mandala PNG" />
        </div>
        <div style="margin: 0 0 20px 0;">
          <a href="${url}" download="${filename}" style="
            display: inline-block; 
            background: linear-gradient(to right, #0287f2, #38bdf8); 
            color: white; 
            text-decoration: none;
            padding: 12px 24px; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 14px;
            margin-right: 10px;
          ">📱 Download PNG</a>
        </div>
        <button onclick="window.pngExporter.closeModal(); URL.revokeObjectURL('${url}')" style="
          background: rgba(60, 55, 68, 0.8); 
          color: #b0b0b0; 
          border: 1px solid rgba(60, 55, 68, 0.6); 
          padding: 12px 24px;
          border-radius: 8px; 
          cursor: pointer; 
          font-weight: 600; 
          font-size: 14px;
        ">Close</button>
      </div>
    `;
  }

  showError(message) {
    if (!this.modal) this.createModal();
    
    this.modal.innerHTML = `
      <div style="
        background: rgba(29, 26, 33, 0.95); 
        backdrop-filter: blur(10px);
        padding: 30px; 
        border-radius: 15px; 
        box-shadow: 0 20px 40px rgba(0,0,0,0.5); 
        max-width: 450px; 
        text-align: center;
        border: 1px solid rgba(60, 55, 68, 0.4);
      ">
        <h3 style="margin: 0 0 15px 0; color: #f87171;">❌ PNG Export Failed</h3>
        <p style="margin: 0 0 20px 0; color: #b0b0b0;">
          ${message}
        </p>
        <button onclick="window.pngExporter.closeModal()" style="
          background: rgba(60, 55, 68, 0.8); 
          color: #b0b0b0; 
          border: 1px solid rgba(60, 55, 68, 0.6); 
          padding: 12px 24px;
          border-radius: 8px; 
          cursor: pointer; 
          font-weight: 600;
        ">Close</button>
      </div>
    `;
  }

  closeModal() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
  }
}

// SVG Export functionality
const exportSVG = async (svgElement, filename = 'quorum-mandala.svg') => {
  if (!svgElement) {
    alert('Could not find mandala to export');
    return;
  }

  try {
    const svgData = svgElement.outerHTML
      .replace(/width="\d+"/, 'width="500"')
      .replace(/height="\d+"/, 'height="500"');

    await navigator.clipboard.writeText(svgData);
    showSVGExportModal();
  } catch (error) {
    console.error('SVG export failed:', error);
    alert('SVG export failed. Please try again.');
  }
};

const showSVGExportModal = () => {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
    align-items: center; justify-content: center; font-family: system-ui;
  `;
  
  modal.innerHTML = `
    <div style="
      background: rgba(29, 26, 33, 0.95); 
      backdrop-filter: blur(10px);
      padding: 30px; 
      border-radius: 15px; 
      box-shadow: 0 20px 40px rgba(0,0,0,0.5); 
      max-width: 450px; 
      text-align: center;
      border: 1px solid rgba(60, 55, 68, 0.4);
    ">
      <h3 style="margin: 0 0 15px 0; color: #0287f2; font-size: 20px;">✅ SVG Ready!</h3>
      <p style="margin: 0 0 20px 0; color: #b0b0b0; line-height: 1.5;">
        Your mandala SVG has been copied to your clipboard.
      </p>
      <div style="
        background: rgba(15, 13, 19, 0.8); 
        padding: 15px; 
        border-radius: 8px; 
        margin: 0 0 20px 0; 
        text-align: left; 
        font-size: 14px;
        border: 1px solid rgba(60, 55, 68, 0.4);
      ">
        <strong style="color: #0287f2;">To save as SVG file:</strong><br>
        <span style="color: #b0b0b0;">
        1. Open any text editor (Notepad, VS Code, etc.)<br>
        2. Paste (Ctrl+V / Cmd+V)<br>
        3. Save as "quorum-mandala.svg"
        </span>
      </div>
      <button onclick="this.closest('div').parentElement.remove()" style="
        background: linear-gradient(to right, #0287f2, #38bdf8); 
        color: white; 
        border: none; 
        padding: 12px 24px;
        border-radius: 8px; 
        cursor: pointer; 
        font-weight: 600; 
        font-size: 14px;
      ">Got it!</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
};

// Export functions
if (typeof window !== 'undefined') {
  // Create global instance
  window.pngExporter = new PNGExporter();
  
  window.ExportUtils = {
    exportPNG: (svgElement, filename) => window.pngExporter.exportMandala(svgElement, filename),
    exportSVG,
    PNGExporter
  };
}
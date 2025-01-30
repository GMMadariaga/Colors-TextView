document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const clearBtn = document.getElementById('clearBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const colorsContainer = document.getElementById('colorsContainer');
    const outputText = document.getElementById('outputText');

    const colorPatterns = {
        hex: /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g,
        rgb: /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/g,
        rgba: /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]\.?\d*)\s*\)/g,
        hsl: /hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)/g
    };

    function extractColors(text) {
        let colors = [];
        
        for (let format in colorPatterns) {
            const matches = text.match(colorPatterns[format]) || [];
            colors = [...colors, ...matches];
        }
        
        return [...new Set(colors)]; // Remove duplicates
    }

    function displayColors(colors) {
        colorsContainer.innerHTML = '';
        
        if (colors.length === 0) {
            outputText.textContent = 'No valid colors detected';
            return;
        }

        outputText.textContent = `Found ${colors.length} color${colors.length > 1 ? 's' : ''}:`;
        
        colors.forEach(color => {
            const colorItem = document.createElement('div');
            colorItem.className = 'colorItem';
            
            const colorBox = document.createElement('div');
            colorBox.className = 'colorBox';
            colorBox.style.backgroundColor = color;
            
            const colorText = document.createElement('span');
            colorText.className = 'colorText';
            colorText.textContent = color;
            
            colorItem.addEventListener('click', () => {
                navigator.clipboard.writeText(color);
                alert(`Copied ${color} to clipboard!`);
            });
            
            colorItem.appendChild(colorBox);
            colorItem.appendChild(colorText);
            colorsContainer.appendChild(colorItem);
        });
    }

    function analyze() {
        const text = inputText.value;
        const colors = extractColors(text);
        displayColors(colors);
    }

    function clear() {
        inputText.value = '';
        colorsContainer.innerHTML = '';
        outputText.textContent = 'No colors detected yet';
    }

    // Event Listeners
    analyzeBtn.addEventListener('click', analyze);
    clearBtn.addEventListener('click', clear);
    inputText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') analyze();
    });
});
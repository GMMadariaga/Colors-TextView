document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const clearBtn = document.getElementById('clearBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const colorsContainer = document.getElementById('colorsContainer');
    const outputText = document.getElementById('outputText');
    const saveBtn = document.getElementById('saveBtn');
    const exportBtn = document.getElementById('exportBtn');
    const complementaryBtn = document.getElementById('complementaryBtn');

    let showComplementary = false; 

    const colorPatterns = {
        hex: /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g,
        rgb: /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/g
    };

    function extractColors(text) {
        let colors = [];
        for (let format in colorPatterns) {
            const matches = text.match(colorPatterns[format]) || [];
            colors = [...colors, ...matches];
        }
        return [...new Set(colors)];
    }

    function rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    function colorToHex(color) {
        let rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (rgb) {
            return rgbToHex(parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3]));
        }
        return color;
    }

    function getComplementaryColor(color) {
        let rgb = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        if (rgb) {
            let r = parseInt(rgb[1], 16);
            let g = parseInt(rgb[2], 16);
            let b = parseInt(rgb[3], 16);
            return rgbToHex(255 - r, 255 - g, 255 - b);
        }
        rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (rgb) {
            return rgbToHex(255 - parseInt(rgb[1]), 255 - parseInt(rgb[2]), 255 - parseInt(rgb[3]));
        }
        return color;
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

            // Contenedor para el color original y su texto
            const originalContainer = document.createElement('div');
            originalContainer.className = 'color-pair';

            const colorBox = document.createElement('div');
            colorBox.className = 'colorBox';
            const hexColor = colorToHex(color);
            colorBox.style.backgroundColor = hexColor;

            const colorText = document.createElement('span');
            colorText.className = 'colorText';
            colorText.textContent = hexColor;

            originalContainer.appendChild(colorBox);
            originalContainer.appendChild(colorText);

            // Contenedor para el color complementario y su texto
            const complementaryContainer = document.createElement('div');
            complementaryContainer.className = 'color-pair complementary-container';
            complementaryContainer.style.display = showComplementary ? 'flex' : 'none';

            const complementaryBox = document.createElement('div');
            complementaryBox.className = 'colorBox complementary';
            const complementaryColor = getComplementaryColor(hexColor);
            complementaryBox.style.backgroundColor = complementaryColor;

            const complementaryText = document.createElement('span');
            complementaryText.className = 'colorText';
            complementaryText.textContent = complementaryColor;

            complementaryContainer.appendChild(complementaryBox);
            complementaryContainer.appendChild(complementaryText);

            colorItem.addEventListener('click', () => {
                navigator.clipboard.writeText(hexColor);
                alert(`Copied ${hexColor} to clipboard!`);
            });

            colorItem.appendChild(originalContainer);
            colorItem.appendChild(complementaryContainer);
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

    function exportPalette() {
        const colors = Array.from(document.querySelectorAll('.colorBox:not(.complementary)')).map(box => box.style.backgroundColor);
        if (colors.length === 0) {
            alert('No colors to export!');
            return;
        }
        const cssCode = colors.map((color, i) => `--color-${i+1}: ${color};`).join('\n');
        navigator.clipboard.writeText(cssCode);
        alert('CSS variables copied to clipboard!');
    }

    complementaryBtn.addEventListener('click', () => {
        showComplementary = !showComplementary;
        document.querySelectorAll('.complementary-container').forEach(container => {
            container.style.display = showComplementary ? 'flex' : 'none';
        });
    });

    analyzeBtn.addEventListener('click', analyze);
    clearBtn.addEventListener('click', clear);
    inputText.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') analyze();
    });
    exportBtn.addEventListener('click', exportPalette);
});

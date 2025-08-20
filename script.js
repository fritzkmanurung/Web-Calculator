let display = document.getElementById('display');
let history = document.getElementById('history');
let currentInput = '0';
let previousInput = '';
let operator = '';
let waitingForOperand = false;
let memory = 0;
let isScientificMode = false;
let angleMode = 'deg'; // 'deg' or 'rad'

// Initialize particles
function createParticles() {
    const particles = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = particle.style.height = Math.random() * 10 + 5 + 'px';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particles.appendChild(particle);
    }
}

function setMode(mode) {
    const calculator = document.getElementById('calculator');
    const buttons = document.querySelectorAll('.mode-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (mode === 'scientific') {
        calculator.classList.remove('basic-mode');
        calculator.classList.add('scientific-mode');
        isScientificMode = true;
    } else {
        calculator.classList.remove('scientific-mode');
        calculator.classList.add('basic-mode');
        isScientificMode = false;
    }
}

function appendToDisplay(value) {
    if (waitingForOperand) {
        currentInput = value;
        waitingForOperand = false;
    } else {
        if (currentInput === '0' && value !== '.') {
            currentInput = value;
        } else {
            currentInput += value;
        }
    }
    updateDisplay();
}

function updateDisplay() {
    display.textContent = currentInput;
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    waitingForOperand = false;
    history.textContent = '';
    updateDisplay();
    animateButton(event.target);
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
    animateButton(event.target);
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
    animateButton(event.target);
}

function toggleSign() {
    if (currentInput !== '0') {
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }
    animateButton(event.target);
}

function scientificFunction(func) {
    const value = parseFloat(currentInput);
    let result;

    try {
        switch (func) {
            case 'sin':
                result = angleMode === 'deg' ? Math.sin(value * Math.PI / 180) : Math.sin(value);
                break;
            case 'cos':
                result = angleMode === 'deg' ? Math.cos(value * Math.PI / 180) : Math.cos(value);
                break;
            case 'tan':
                result = angleMode === 'deg' ? Math.tan(value * Math.PI / 180) : Math.tan(value);
                break;
            case 'asin':
                result = angleMode === 'deg' ? Math.asin(value) * 180 / Math.PI : Math.asin(value);
                break;
            case 'acos':
                result = angleMode === 'deg' ? Math.acos(value) * 180 / Math.PI : Math.acos(value);
                break;
            case 'atan':
                result = angleMode === 'deg' ? Math.atan(value) * 180 / Math.PI : Math.atan(value);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'factorial':
                result = factorial(Math.floor(value));
                break;
            default:
                return;
        }

        if (isFinite(result)) {
            currentInput = result.toString();
            updateDisplay();
            animateSuccess();
        } else {
            showError();
        }
    } catch (error) {
        showError();
    }
    animateButton(event.target);
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function calculate() {
    try {
        let expression = currentInput;
        
        // Replace display symbols with JS operators
        expression = expression.replace(/×/g, '*');
        expression = expression.replace(/÷/g, '/');
        expression = expression.replace(/\^/g, '**');
        
        // Handle special cases
        expression = expression.replace(/Math\.PI/g, Math.PI);
        expression = expression.replace(/Math\.E/g, Math.E);
        
        history.textContent = currentInput + ' =';
        
        const result = Function('"use strict"; return (' + expression + ')')();
        
        if (isFinite(result)) {
            currentInput = result.toString();
            updateDisplay();
            animateSuccess();
        } else {
            showError();
        }
    } catch (error) {
        showError();
    }
    animateButton(document.getElementById('equalsBtn'));
}

// Memory functions
function memoryStore() {
    memory = parseFloat(currentInput) || 0;
    updateMemoryIndicator();
    animateButton(event.target);
}

function memoryRecall() {
    currentInput = memory.toString();
    updateDisplay();
    animateButton(event.target);
}

function memoryClear() {
    memory = 0;
    updateMemoryIndicator();
    animateButton(event.target);
}

function memoryAdd() {
    memory += parseFloat(currentInput) || 0;
    updateMemoryIndicator();
    animateButton(event.target);
}

function memorySubtract() {
    memory -= parseFloat(currentInput) || 0;
    updateMemoryIndicator();
    animateButton(event.target);
}

function updateMemoryIndicator() {
    const indicator = document.getElementById('memoryIndicator');
    if (memory !== 0) {
        indicator.classList.add('active');
    } else {
        indicator.classList.remove('active');
    }
}

function animateButton(button) {
    button.classList.add('success');
    setTimeout(() => button.classList.remove('success'), 200);
}

function animateSuccess() {
    display.classList.add('success');
    setTimeout(() => display.classList.remove('success'), 500);
}

function showError() {
    display.textContent = 'Error';
    display.classList.add('error');
    setTimeout(() => {
        display.classList.remove('error');
        currentInput = '0';
        updateDisplay();
    }, 1500);
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    event.preventDefault();
    
    if (/[0-9]/.test(key)) appendToDisplay(key);
    else if (key === '+') appendToDisplay('+');
    else if (key === '-') appendToDisplay('-');
    else if (key === '*') appendToDisplay('*');
    else if (key === '/') appendToDisplay('/');
    else if (key === '.') appendToDisplay('.');
    else if (key === 'Enter' || key === '=') calculate();
    else if (key === 'Escape') clearAll();
    else if (key === 'Backspace') backspace();
    else if (key === 'c' || key === 'C') clearEntry();
});

// Initialize
createParticles();
setMode('basic');
updateDisplay();
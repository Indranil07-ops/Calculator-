document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');

    let currentInput = '';
    let previousInput = '';
    let operator = null;
    let waitingForSecondOperand = false;

    
    const updateDisplay = () => {
        
        display.value = currentInput || '0';
    };

    
    const clear = () => {
        currentInput = '';
        previousInput = '';
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    };

    
    const inputDigit = (digit) => {
        if (waitingForSecondOperand) {
            currentInput = digit;
            waitingForSecondOperand = false;
        } else {
            
            if (digit === '.' && currentInput.includes('.')) return;
            
            if (currentInput.length >= 15) return; 

            currentInput = currentInput === '0' && digit !== '.' ? digit : currentInput + digit;
        }
        updateDisplay();
    };

    
    const calculate = (num1, num2, op) => {
        const a = parseFloat(num1);
        const b = parseFloat(num2);
        if (isNaN(a) || isNaN(b)) return;

        switch (op) {
            case '+':
                return (a + b);
            case '-':
                return (a - b);
            case '*':
                return (a * b);
            case '/':
                if (b === 0) {
                    alert('Error: Division by zero');
                    return NaN; // Indicate an error state
                }
                return (a / b);
            case '%':
                return (a * b) / 100;
            default:
                return b;
        }
    };

    
    const handleOperator = (nextOperator) => {
        const inputValue = parseFloat(currentInput);

        
        if (nextOperator === 'clear') {
            clear();
            return;
        }

        
        if (nextOperator === 'sign') {
            currentInput = String(inputValue * -1);
            updateDisplay();
            return;
        }
        
        
        if (nextOperator === 'percent') {
            currentInput = String(inputValue / 100);
            updateDisplay();
            return;
        }

        
        if (operator === null) {
            previousInput = currentInput;
            operator = nextOperator;
            waitingForSecondOperand = true;
            return;
        }

        
        if (previousInput && operator && !waitingForSecondOperand) {
            const result = calculate(previousInput, currentInput, operator);

            currentInput = String(result);
            previousInput = currentInput; // The result becomes the next previousInput
            operator = nextOperator;
            waitingForSecondOperand = true;
            updateDisplay();
        }
    };

    
    buttons.addEventListener('click', (event) => {
        const { target } = event;

        
        if (!target.matches('button')) return;

        
        if (target.dataset.value) {
            inputDigit(target.dataset.value);
            return;
        }

        
        if (target.dataset.action) {
            const action = target.dataset.action;

            if (action === 'calculate') {
                if (previousInput && operator) {
                    const result = calculate(previousInput, currentInput, operator);
                    
                    // Display result, round to avoid floating point issues
                    currentInput = String(parseFloat(result.toFixed(8)));
                    previousInput = ''; // Calculation is complete
                    operator = null;
                    waitingForSecondOperand = true; // Wait for new input
                    updateDisplay();
                }
                return;
            }

            // Handle other operators/actions
            handleOperator(action);
            return;
        }
    });

    // Initial display update
    updateDisplay();
});
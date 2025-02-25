import { Stack } from './stack.js'
import { Queue } from './queue.js'

import * as math from './calculateExpression.js'
import * as Integral from './Integral.js'
import * as Derivative from './Derivative.js'

let functions = new Map();

functions.set('f', 'x^2'); // pre-defined function

// helper function to determine if a given string
// is an operand or a number
function isNumber(str) {
    return !isNaN(str)
}

// helper function to determine if a given string
// is a mathematical fucntion
function isFunction(input) {
    const mathFunctions = new Set([
        'sin', 'cos', 'tan', 
        'arcsin', 'arccos', 'arctan',
        'csc', 'sec', 'cot',
        '√', 'log', 'ln'])

    const normalizedInput = input.toLowerCase()

    return mathFunctions.has(normalizedInput)
}

// helper function to return the precedence of a given operator
function precedence(operator) {
    if (operator == '+' || operator == '-') return 1
    if (operator == '*' || operator == '/') return 2
    if (operator == '^') return 3
    if (isFunction(operator)) return 4
    return 0
}

// helper function to apply each operation, given an operator
function applyOperator(operator, a, b=NaN) {
    switch (operator) {
        case '+': return math.sum(a,b);
        case '-': return math.subtract(a,b);
        case '*': return math.multiply(a,b);
        case '/': return math.divide(a,b);
        case '^': return math.exp(a,b);
        case '√': return Math.sqrt(a);

        case 'sin': return Math.sin(a);
        case 'cos': return Math.cos(a);
        case 'tan': return Math.tan(a);
        case 'arcsin': return Math.asin(a);
        case 'arccos': return Math.acos(a);
        case 'arctan': return Math.atan(a);
        case 'csc': return 1 / Math.sin(a);
        case 'sec': return 1 / Math.cos(a);
        case 'cot': return 1 / Math.tan(a);

        case 'abs': return Math.abs(a);

        case 'log': return Math.log10(a);
        case 'ln': return Math.log(a);

        // case 'int': return ;
    }
}

// helper function to check if a given string is a constant
// e.g. 'pi' => Math.PI, 'e' => Math.E
function isConstant(str) {
    const normalizedStr = str.toLowerCase()

    return normalizedStr == 'pi' || normalizedStr == 'e'
}

// helper function to convert each constant to Math.*
function convertConstant(constant) {
    switch (constant.toLowerCase()) {
        case 'pi': return Math.PI;
        case 'e': return Math.E;
    }
}

// helper function to group separated numbers to a single string
function groupNums(arr) {
    let result = [];
    let temp = '';

    for (let i = 0; i < arr.length; i++) {
        if (isNumber(arr[i])) {
            temp += arr[i];
        } else {
            if (temp) {
                result.push(temp);
                temp = ""; 
            }
            result.push(arr[i]); 
        }
    }

    if (temp) result.push(temp);

    return result;
}

// helper to handle JuckBoon. result is numerical string
function handleJuckBoon(arr) {
    let max = '';
    let min = '';
    let value = '';
    let i = 0;

    while (i < arr.length) {
        if (arr[i] === "_INT_UPPER_BRACKET_OPEN_") {
            i++;
            while (i < arr.length && arr[i] !== "_INT_UPPER_BRACKET_CLOSE_") {
                if (arr[i] != 'cursor') max += arr[i];
                i++;
            }
        } else if (arr[i] === "_INT_LOWER_BRACKET_OPEN_") {
            i++;
            while (i < arr.length && arr[i] !== "_INT_LOWER_BRACKET_CLOSE_") {
                if (arr[i] != 'cursor') min += arr[i];
                i++;
            }
        } else if (arr[i] === "_INT_VALUE_BRACKET_OPEN_") {
            i++;
            while (i < arr.length && arr[i] !== "_INT_VALUE_BRACKET_CLOSE_") {
                if (arr[i] != 'cursor') value += arr[i];
                i++;
            }
        }
        i++;
    }

    const res = Integral.integral(value, min, max, 50000)
    const roundedRes = parseFloat(res.toFixed(4))
    return roundedRes.toString();
}

// helper to handle MiBoon. result is either numerical value or expression containing x
function handleMiBoon(arr) {
    let eq = functions.get(arr[0]);
    if (isNumber(arr[3])) {
        return Derivative.derivative(eq, arr[3]).toString();
    } else {
        return Derivative.derivative(eq).toString();
    }
}

// helper to check if arr contains any MiJuckBoon, and handles
function handleMiJuckBoon(arr) {
    let res = []

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == 'i' &&
            arr[i + 1] == 'n' &&
            arr[i + 2] == 't') {
                // case JuckBoon
                let juckBoonRes = handleJuckBoon([...arr].slice(i));
                res.push(juckBoonRes);

                while (i < arr.length && arr[i] !== "_INT_VALUE_BRACKET_CLOSE_") {
                    i++;
                }
        } else if (arr[i] == '\'') {
            res.pop();
            let miBoonRes = handleMiBoon([...arr].splice(i - 1))

            res.push(miBoonRes);
            i += 3;
        } else {
            res.push(arr[i]);
        }
    }
    
    return res;
}

// helper function: inputs an array with single letter/number, and
// outputs an array with grouped words (e.g. sqrt, sin, cos, etc)
function groupWords(input) {
    let result = [];
    // Temporary variable to collect letters
    let temp = "";
    const openingBrackets = [
        "_EXPONENT_OPEN_", "_FRACTION_OPEN_", "_SQUARE_ROOT_OPEN_", 
        "_LOG_OPEN_", "_SQUARE_ROOT_OPEN_", "_LN_OPEN_",
        // "_INT_UPPER_BRACKET_OPEN_", "_INT_LOWER_BRACKET_OPEN_", "_INT_VALUE_BRACKET_OPEN_"
    ]
    const closingBrackets = [
        "_EXPONENT_CLOSE_", "_FRACTION_CLOSE_", "_SQUARE_ROOT_CLOSE_", 
        "_LOG_CLOSE_", "_SQUARE_ROOT_CLOSE_", "_LN_CLOSE_",
        // "_INT_UPPER_BRACKET_CLOSE_", "_INT_LOWER_BRACKET_CLOSE_", "_INT_VALUE_BRACKET_CLOSE_"
    ]
    const operator = [
        'cos', 'sin', 'tan', 
        'arcsin', 'arccos', 'arctan',
        'csc', 'sec', 'cot',
        'log', 'ln', 
        // 'int',
        '+', '-', '*', '/', '√'
    ]

    let arr = handleMiJuckBoon(input)
    // let arr = [...input]

    for (let i = 0; i < arr.length; i++) {
        // Check if the current element is a letter and add to temp
        if (/[a-zA-Z]/.test(arr[i])) {
            temp += arr[i];
            
            // if temp is a constant (e.g. pi or e), add to result
            if (isConstant(temp)) {
                result.push(temp);
                temp = '';
            }
            
            if (operator.includes(temp)) {
                result.push(temp);
                temp = '';
            }

            if (openingBrackets.includes(temp)) {
                result.push("(");
                temp = '';
            }

            if (closingBrackets.includes(temp)) {
                result.push(")");
                temp = '';
            }

            if (temp == 'cursor') {
                temp = '';
            }
        } else {
            if (temp) {
                // Push leftover letters and reset temp
                result.push(temp); 
                temp = ""; 
            }
            // Push non-letter characters as-is
            result.push(arr[i]); 
        }
    }

    return groupNums(result);
}

// converts a given infix to postfix expression
function infixToPostfix(infix) {
    let stack = new Stack()
    let queue = new Queue()
    let groupedStr = groupWords(infix)

    for (let i=0; i<groupedStr.length; i++) {

        // checking if str is a number
        if (isNumber(groupedStr[i])) {
            queue.enqueue(Number(groupedStr[i]))  // adding it to the queue

        } else if (isConstant(groupedStr[i])) {
            queue.enqueue(groupedStr[i]) // adding it to the queue

        } else if (groupedStr[i] == '(') {
            stack.push(groupedStr[i]) // adding it to the stack

        // checking if str is a end of a parenthesis,
        // if so, pop from the stack and enqueue to the queue
        // until '(' is found
        } else if (groupedStr[i] == ')') {
            while (!stack.isEmpty() && stack.peek() !== '(') {
                queue.enqueue(stack.pop())
            }
            stack.pop() // remove the '('

        // str is an operator
        // if the precedence of the first item in the stack is greater than
        // the precedence of str, then pop from the stack and enqueue to the queue
        } else {
            while (!stack.isEmpty() && precedence(stack.peek()) >= precedence(groupedStr[i])) {
                queue.enqueue(stack.pop())
            }
            stack.push(groupedStr[i])
        }
    }
    
    // enqueue all the items in the stack
    while (!stack.isEmpty()) {
        queue.enqueue(stack.pop())
    }

    return queue.getItems()
}

// returns expression as a string
function makeExpression(arr) {
    let res = '';
    // let temp = groupNums(groupWords(arr));
    let temp = handleMiJuckBoon(arr);

    console.log(temp)

    for (let i = 0; i < temp.length; i++) {
        if (temp[i] == '^') {
            res += '**'
        } else {
            res += temp[i];
        }
    }

    return res;
}

// evaluates the given expression in an array
function evaluateExpression(expression) {
    let stack = new Stack()
    let postfix = infixToPostfix(expression)

    if (postfix.includes('x')) {
        return expression;
    }

    for (let i = 0; i < postfix.length; i++) {

        if (typeof postfix[i] == 'number') {
            stack.push(postfix[i])

        } else if (isConstant(postfix[i])) {
            let a = convertConstant(postfix[i])
            stack.push(a)

        } else if (isFunction(postfix[i])) {
            const a = stack.pop()
            stack.push(applyOperator(postfix[i], a))

        } else {
            const b = stack.pop()
            const a = stack.pop()
            stack.push(applyOperator(postfix[i], a, b))

        }
    }
    return stack.pop()
}

export function returnOutput(arr) {
    function containsX(arr) {
        return arr.some(element => element.includes('x'));
    }
    let temp = handleMiJuckBoon([...arr]);

    if (containsX(temp)) {
        return makeExpression(arr);
    }
    
    return evaluateExpression(arr);
}

// test suite


// 1. Take in an array of letters ex) '3x+2' = ['3','x','+','2']
// 2. First group the words like sqrt, sin or etc
// 3. Apply Stack Algorithm
// 4. Apply operation by given operators (functions like sin, cos, etc included)


// test 1
// console.log(infixToPostfix(["2", "*", "s", "i", "n", "(", "c", "o", "s", "(", "3", ")", "+", "1", ")", "+", "5"]))
// console.log(evaluateExpression(["2", "*", "s", "i", "n", "(", "c", "o", "s", "(", "3", ")", "+", "1", ")", "+", "5"]))
// console.log(applyOperator('cos', 3))
// console.log(Math.cos(3))

// test 2
// const statement = ['s','q','r','t','4','+','3', '*', 's', 'i', 'n','(','p', 'i', ')']

// console.log(groupWords(statement))
// console.log(infixToPostfix(statement))
// console.log(evaluteExpression(statement))

// test Exponents
// const exponentsArray = ["1", "2", "+", "4", "^", "_EXPONENT_OPEN_", "1", "6", "/", "8", "cursor", "_EXPONENT_CLOSE_"]
// console.log(groupWords(exponentsArray))
// console.log(makeExpression(exponentsArray))
// console.log(infixToPostfix(exponentsArray))
// console.log(evaluateExpression(exponentsArray))

// test Log
// const logArray = ["l","o","g","_LOG_OPEN_", "1", "2", "^", "_EXPONENT_OPEN_", "2", "cursor", "_EXPONENT_CLOSE_", "+", "pi", "_LOG_CLOSE_"]
// console.log(groupWords(logArray))
// console.log(infixToPostfix(logArray))
// console.log(evaluateExpression(logArray))

// test sqrt
// const sqrtArray = ['√', '_SQUARE_ROOT_OPEN_', '2', '^', "_EXPONENT_OPEN_", "2", "_EXPONENT_CLOSE_", '+', '3', '4', '*', '√', '_SQUARE_ROOT_OPEN_', '4', '_SQUARE_ROOT_CLOSE_', '_SQUARE_ROOT_CLOSE_', 'cursor']
// const sqrtArray = ['√', '_SQUARE_ROOT_OPEN_', '4', '_SQUARE_ROOT_CLOSE_']

// console.log(groupWords(sqrtArray))
// console.log(makeExpression(sqrtArray))
// console.log(infixToPostfix(sqrtArray))
// console.log(evaluateExpression(sqrtArray))

//test ln
// const lnArray = ['l', 'n', '_LN_OPEN_', 'e', '_LN_CLOSE_']
// console.log(returnOutput(lnArray))
// console.log(groupWords(lnArray))
// console.log(makeExpression(lnArray))
// console.log(infixToPostfix(lnArray))
// console.log(evaluateExpression(lnArray))

//test trig

// const trigArray = [
//     's', 'i', 'n', '3', '+',
//     'c', 'o', 's', '2', '+',
//     't', 'a', 'n', '5', '+', 
//     'a', 'r', 'c', 's', 'i', 'n', '0.5', '+', 
//     'a', 'r', 'c', 'c', 'o', 's', '0.5', '+', 
//     'a', 'r', 'c', 't', 'a', 'n', '2', '+',
//     'c', 's', 'c', '3', '+',
//     's', 'e', 'c', '4', '+', 
//     'c', 'o', 't', '3'
// ]
// console.log(groupWords(trigArray))
// console.log(makeExpression(trigArray))
// console.log(infixToPostfix(trigArray))
// console.log(evaluateExpression(trigArray))
// console.log(returnOutput(trigArray))

// test integral

// const miJuckBoonArray = [
//     '3', '+',
//     'i', 'n', 't', 
//     '_INT_UPPER_BRACKET_OPEN_', '3', '_INT_UPPER_BRACKET_CLOSE_', 
//     '_INT_LOWER_BRACKET_OPEN_', '1', '_INT_LOWER_BRACKET_CLOSE_', 
//     '_INT_VALUE_BRACKET_OPEN_', 'x', 'cursor', '_INT_VALUE_BRACKET_CLOSE_',
//     '+', 'f', '\'', '(', 
//     'x', 
//     // '2',
//     ')', '*', '2'

// ]

// console.log(handleMiJuckBoon(miJuckBoonArray))
// console.log(evaluateExpression(miJuckBoonArray))
// console.log(handleMiJuckBoon(miJuckBoonArray))
// console.log(makeExpression(miJuckBoonArray))
// console.log(returnOutput(miJuckBoonArray))


// test everything

// const everythingArray = [
//     'i', 'n', 't', 
//     '_INT_UPPER_BRACKET_OPEN_', '3', '_INT_UPPER_BRACKET_CLOSE_', 
//     '_INT_LOWER_BRACKET_OPEN_', '1', '_INT_LOWER_BRACKET_CLOSE_', 
//     '_INT_VALUE_BRACKET_OPEN_', 'x', '_INT_VALUE_BRACKET_CLOSE_',
//     '+', 
//     'f', '\'', '(', '2', ')',
//     '*', 
//     's', 'i', 'n', '(', 'x', ')', 
//     '/', 
//     'c', 'o', 's', '(', 'x', ')', 
//     '-', 
//     'l', 'o', 'g', '(', 'x', ')', 
//     '+', 
//     'l', 'n', '(', 'x', ')', 
//     '*', 
//     'e', '^', 'x', 
//     '+', 
//     'p', 'i', 
//     '-', 
//     'e',
//     '+',
//     't', 'a', 'n', '(', 'x', ')',
//     '-',
//     'a', 'r', 'c', 's', 'i', 'n', '(', 'x', ')',
//     '+',
//     'a', 'r', 'c', 'c', 'o', 's', '(', 'x', ')',
//     '-',
//     'a', 'r', 'c', 't', 'a', 'n', '(', 'x', ')',
//     '+',
//     'c', 's', 'c', '(', 'x', ')',
//     '-',
//     's', 'e', 'c', '(', 'x', ')',
//     '+',
//     'c', 'o', 't', '(', 'x', ')',
//     '+',
//     '√', '(', 'x', ')'
// ];

// const everythingArrayOnlyNums = [
//     'i', 'n', 't', 
//     '_INT_UPPER_BRACKET_OPEN_', '3', '_INT_UPPER_BRACKET_CLOSE_', 
//     '_INT_LOWER_BRACKET_OPEN_', '1', '_INT_LOWER_BRACKET_CLOSE_', 
//     '_INT_VALUE_BRACKET_OPEN_', '2', '_INT_VALUE_BRACKET_CLOSE_', 
//     '+', 
//     'f', '\'', '(', '2', ')',
//     '*', 
//     's', 'i', 'n', '(', '1', ')', 
//     '/', 
//     'c', 'o', 's', '(', '1', ')', 
//     '-', 
//     'l', 'o', 'g', '(', '10', ')', 
//     '+', 
//     'l', 'n', '(', '2', ')', 
//     '*', 
//     'e', '^', '2', 
//     '+', 
//     'p', 'i', 
//     '-', 
//     'e',
//     '+',
//     't', 'a', 'n', '(', '1', ')',
//     '-',
//     'a', 'r', 'c', 's', 'i', 'n', '(', '0.5', ')',
//     '+',
//     'a', 'r', 'c', 'c', 'o', 's', '(', '0.5', ')',
//     '-',
//     'a', 'r', 'c', 't', 'a', 'n', '(', '1', ')',
//     '+',
//     'c', 's', 'c', '(', '1', ')',
//     '-',
//     's', 'e', 'c', '(', '1', ')',
//     '+',
//     'c', 'o', 't', '(', '1', ')',
//     '+',
//     '√', '(', '4', ')'
// ];

const everythingArray = [
    'i', 'n', 't', 
    '_INT_UPPER_BRACKET_OPEN_', '3', '_INT_UPPER_BRACKET_CLOSE_', 
    '_INT_LOWER_BRACKET_OPEN_', '1', '_INT_LOWER_BRACKET_CLOSE_', 
    '_INT_VALUE_BRACKET_OPEN_', 'x', '_INT_VALUE_BRACKET_CLOSE_',
    '+', 
    'f', '\'', '(', '2', ')',
    '*', 
    's', 'i', 'n', '(', '1', ')', 
    '/', 
    'c', 'o', 's', '(', '1', ')', 
    '-', 
    'l', 'o', 'g', "_LOG_OPEN_", '10', "_LOG_CLOSE_", 
    '^', 
    "_EXPONENT_OPEN_",
    'l', 'n', "_LN_OPEN_", '2', "_LN_CLOSE_", 
    "_EXPONENT_CLOSE_",
    '*', 
    'e', '^', "_EXPONENT_OPEN_", '2', "_EXPONENT_CLOSE_",
    '+', 
    'p', 'i', 
    '-', 
    'e',
    '+',
    't', 'a', 'n', '(', '1', ')',
    '-',
    'a', 'r', 'c', 's', 'i', 'n', '(', '0.5', ')',
    '+',
    'a', 'r', 'c', 'c', 'o', 's', '(', '0.5', ')',
    '-',
    'a', 'r', 'c', 't', 'a', 'n', '(', '1', ')',
    '+',
    'c', 's', 'c', '(', '1', ')',
    '-',
    's', 'e', 'c', '(', '1', ')',
    '+',
    'c', 'o', 't', '(', '1', ')',
    '+',
    '√', '(', '4', ')'
];

console.log(groupWords(everythingArray))
console.log(infixToPostfix(everythingArray))
console.log(evaluateExpression(everythingArray))
console.log(returnOutput(everythingArray))

console.log(precedence('pi'))
console.log(returnOutput([
    'p','i',
    '-',
    'e'
]))
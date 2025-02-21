import { Stack } from './stack.js'
import { Queue } from './queue.js'

import * as math from './calculateExpression.js'


// helper function to determine if a given string
// is an operand or a number
function isNumber(str) {
    return !isNaN(str)
}

// helper function to determine if a given string
// is a mathematical fucntion
function isFunction(input) {
    const mathFunctions = new Set(['sin', 'cos', 'tan', '√', 'log', 'ln'])

    const normalizedInput = input.toLowerCase()

    return mathFunctions.has(normalizedInput)
}

// helper function to return the precedence of a given operator
function precedence(operator) {
    if (operator == '+' || operator == '-') return 1
    if (operator == '*' || operator == '/' || operator == '^' || isFunction(operator)) return 2
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
        case 'abs': return Math.abs(a);
        case 'log': return Math.log10(a);
        case 'ln': return Math.log(a);
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

function groupNums(arr) {
    let result = [];
    let temp = "";

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

    return result;
}


// helper function: inputs an array with single letter/number, and
// outputs an array with grouped words (e.g. sqrt, sin, cos, etc)
function groupWords(input) {
    let result = [];
    // Temporary variable to collect letters
    let temp = "";
    const openingBrackets = ["_EXPONENT_OPEN_", "_FRACTION_OPEN_", "_SQUARE_ROOT_OPEN_", "_LOG_OPEN_", "_SQUARE_ROOT_OPEN_", "_LN_OPEN_"]
    const closingBrackets = ["_EXPONENT_CLOSE_", "_FRACTION_CLOSE_", "_SQUARE_ROOT_CLOSE_", "_LOG_CLOSE_", "_SQUARE_ROOT_CLOSE_", "_LN_CLOSE_"]
    const operator = ['cos', 'sin', 'tan', 'log', 'ln', '+', '-', '*', '/', '√']

    for (let i = 0; i < input.length; i++) {
        // Check if the current element is a letter and add to temp
        if (/[a-zA-Z]/.test(input[i])) {
            temp += input[i];
            
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
            result.push(input[i]); 
        }
    }

    return groupNums(result);
}

export function makeExpression(arr) {
    let res = '';
    let temp = groupNums(groupWords(arr));

    for (let i = 0; i < temp.length; i++) {
        res += temp[i];
    }

    return res;
}

// converts a given infix to postfix expression
export function infixToPostfix(str) {
    let stack = new Stack()
    let queue = new Queue()
    let groupedStr = groupWords(str)

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
            while (!stack.isEmpty() && precedence(stack.peek()) > precedence(groupedStr[i])) {
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


// evaluates the given expression in an array
export function evaluateExpression(expression) {
    let stack = new Stack()
    let postfix = infixToPostfix(expression)

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
// console.log(groupWords(lnArray))
// console.log(makeExpression(lnArray))
// console.log(infixToPostfix(lnArray))
// console.log(evaluateExpression(lnArray))
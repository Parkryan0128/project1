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
    const mathFunctions = new Set(['sin', 'cos', 'tan', 'sqrt'])

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
        case 'sqrt': return Math.sqrt(a); // need to determine which symnbol to use
        case 'sin': return Math.sin(a)
        case 'cos': return Math.cos(a)
        case 'tan': return Math.tan(a)
        case 'abs': return Math.abs(a)
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


// helper function: inputs an array with single letter/number, and
// outputs an array with grouped words (e.g. sqrt, sin, cos, etc)
function groupWords(input) {
    let result = [];
    // Temporary variable to collect letters
    let temp = "";

    for (let i = 0; i < input.length; i++) {
        // Check if the current element is a letter and add to temp
        if (/[a-zA-Z]/.test(input[i])) { 
            temp += input[i]; 
            
            // if temp is a constant (e.g. pi or e), add to result
            if (isConstant(temp)) {
                result.push(temp);
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

    // If there's anything left in temp, add it to the result
    // if (temp) {
    //     result.push(temp);
    // }

    return result;
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

        // checking if str is  a end of a parenthesis,
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
export function evaluteExpression(expression) {
    let stack = new Stack()
    let postfix = infixToPostfix(expression)

    for (let i = 0; i < postfix.length; i++) {

        if (typeof postfix[i] == 'number') {
            stack.push(postfix[i])

        } else if (isConstant(postfix[i])) {
            let a = convertConstant(postfix[i])
            stack.push(a)

        } else if (postfix[i].length > 1) {
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

// test 2
// const statement = ['s','q','r','t','4','+','3', '*', 's', 'i', 'n','(','p', 'i', ')']

// console.log(groupWords(statement))
// console.log(infixToPostfix(statement))
// console.log(evaluteExpression(statement))

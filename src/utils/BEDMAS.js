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
        case 'sqrt': return math.root(a,b); // need to determine which symnbol to use
        case 'sin': return Math.sin(a)
        case 'cos': return Math.cos(a)
        case 'tan': return Math.tan(a)
        case 'abs': return Math.abs(a)
    }
}

// inputs an array with single letter/number, and
// outputs an array with grouped words (e.g. sqrt, sin, cos, etc)
function groupWords(input) {
    let result = [];
    // Temporary variable to collect letters
    let temp = "";

    for (let i = 0; i < input.length; i++) {
        // Check if the current element is a letter and add to temp
        if (/[a-zA-Z]/.test(input[i])) { 
            temp += input[i]; 
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
    let gruopedStr = groupWords(str)

    for (let i=0; i<gruopedStr.length; i++) {

        // checking if str is a number
        if (isNumber(gruopedStr[i])) {
            queue.enqueue(Number(gruopedStr[i]))  // adding it to the queue

        // checking if str is a start of a parenthesis
        } else if (gruopedStr[i] == '(') {
            stack.push(gruopedStr[i]) // adding it to the stack

        // checking if str is  a end of a parenthesis,
        // if so, pop from the stack and enqueue to the queue
        // until '(' is found
        } else if (gruopedStr[i] == ')') {
            while (!stack.isEmpty() && stack.peek() !== '(') {
                queue.enqueue(stack.pop())
            }
            stack.pop() // remove the '('

        // str is an operator
        // if the precedence of the first item in the stack is greater than
        // the precedence of str, then pop from the stack and enqueue to the queue
        } else {
            while (!stack.isEmpty() && precedence(stack.peek()) > precedence(gruopedStr[i])) {
                queue.enqueue(stack.pop())
            }
            stack.push(gruopedStr[i])
        } 
    }
    
    // enqueue all the items in the stack
    while (!stack.isEmpty()) {
        queue.enqueue(stack.pop())
    }

    return queue.getItems()
}


// evaluates the given expression in an array
export function evalutePostfix(expression) {
    let stack = new Stack()
    let postfix = infixToPostfix(expression)

    for (let i = 0; i < postfix.length; i++) {

        console.log(postfix[i])
        if (typeof postfix[i] == 'number') {
            stack.push(postfix[i])
            console.log(stack.getItems())

        } else if (postfix[i].length > 1) {
            const a = stack.pop()
            stack.push(applyOperator(postfix[i], a))
            console.log(stack.getItems())
        } else {
            const b = stack.pop()
            const a = stack.pop()
            stack.push(applyOperator(postfix[i], a, b))
            console.log(stack.getItems())
        }
    }
    return stack.pop()
}


// 1. Take in an array of letters ex) '3x+2' = ['3','x','+','2']
// 2. First group the words like sqrt, sin or etc
// 3. Apply Stack Algorithm
// 4. Apply operation by given operators (functions like sin, cos, etc included)

// console.log(infixToPostfix(["2", "*", "s", "i", "n", "(", "c", "o", "s", "(", "3", ")", "+", "1", ")", "+", "5"]))
// console.log(evalutePostfix(["2", "*", "s", "i", "n", "(", "c", "o", "s", "(", "3", ")", "+", "1", ")", "+", "5"]))
// console.log(applyOperator('cos', 3))
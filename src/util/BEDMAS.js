import { Stack } from './stack.js'
import { Queue } from './queue.js'

import * as math from './calculateExpression.js'


// helper function to determine if a given string is
// is an operand or a number
function isNumber(str) {
    return !isNaN(str) && str.trim() !== ""
}

// helper function to return the precedence of a given operator
function precedence(operator) {
    if (operator == '+' || operator == '-') return 1
    if (operator == '*' || operator == '/') return 2
    if (operator == '^') return 3
    return 0
}

// helper function to apply each operation, given an operator
function applyOperator(operator, a, b) {
    switch (operator) {
        case '+': return math.sum(a,b);
        case '-': return math.subtract(a,b);
        case '*': return math.multiply(a,b);
        case '/': return math.divide(a,b);
        case '^': return math.exp(a,b);
        case '.': return math.root(a,b); // need to determine which symnbol to use
    }
}

// converts a given infix to postfix expression
function infixToPostfix(str) {
    let stack = new Stack()
    let queue = new Queue()


    for (let letter of str) {
        // checking if str is a number
        if (isNumber(letter)) {
            queue.enqueue(Number(letter))  // adding it to the queue

        // checking if str is a start of a parenthesis
        } else if (letter == '(') {
            stack.push(letter) // adding it to the stack

        // checking if str is  a end of a parenthesis,
        // if so, pop from the stack and enqueue to the queue
        // until '(' is found
        } else if (letter == ')') {
            while (!stack.isEmpty() && stack.peek() !== '(') {
                queue.enqueue(stack.pop())
            }
            stack.pop() // remove the '('

        // str is an operator
        // if the precedence of the first item in the stack is greater than
        // the precedence of str, then pop from the stack and enqueue to the queue
        } else {
            while (!stack.isEmpty() && precedence(stack.peek()) > precedence(letter)) {
                queue.enqueue(stack.pop())
            }
            stack.push(letter)
        } 
    }
    
    // enqueue all the items in the stack
    while (!stack.isEmpty()) {
        queue.enqueue(stack.pop())
    }

    return queue.getItems()
}

// evaluates the given postfix expression
export function evalutePostfix(expression) {
    let stack = new Stack()
    let postfix = infixToPostfix(expression)

    for (let i in postfix) {
        if (typeof postfix[i] == 'number') {
            stack.push(postfix[i])
            
        } else {
            const b = stack.pop()
            const a = stack.pop()
            stack.push(applyOperator(postfix[i], a, b))
        }
    }
    return stack.pop()
}
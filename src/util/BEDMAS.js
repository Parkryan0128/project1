import { Stack } from './stack.js'
import { Queue } from './queue.js'



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

// evaluates the given string of expression
function evaluate(str) {
    let stack = new Stack()
    let queue = new Queue()


    for (let i = 0; i < str.length; i++) {
        if (isNumber(str[i])) {
            queue.enqueue(Number(str[i]))
        } else if (str[i] == '(') {
            stack.push(str[i])
        } else if (str[i] == ')') {
            // will do tmr
        } 
    }
}

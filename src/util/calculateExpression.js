
// A helper function that adds two numbers
export function sum(a,b) {
    return Number(a) + Number(b)
}

// A helper function that subtracts two numbers
export function subtract(a,b) {
    return Number(a) - Number(b);
}

// A helper function that multiplies two numbers
export function multiply(a, b) {
    return Number(a) * Number(b)
}

// A helper function that divides the first number by the second number
export function divide(a, b) {
    const numA = Number(a)
    const numB = Number(b)

    if (numB == 0) {
        throw new Error("Division by zero is not allowed")
    }
    
    return numA / numB
}

// A helper function that applies powers to a number
export function exp(a, power) {
    return Number(a) ** Number(power)
}

// A helper function that applies n-th root to a number
export function root(a, n) {
    return Number(a) ** (1/n)
}

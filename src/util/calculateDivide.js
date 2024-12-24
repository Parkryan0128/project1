
// A helper function that divides the first number by the second number
export function divide(a, b) {
    const numA = Number(a)
    const numB = Number(b)

    if (numB == 0) {
        throw new Error("Division by zero is not allowed")
    }
    
    return numA / numB
}

// test
// console.log(divide(1,2))
// console.log(divide(1,0))
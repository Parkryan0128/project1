import * as math from 'mathjs'; // I am just wondering if we can use this library,as I was told that we were not supposed to use a library.

/**
 * @param {string} f - The function as a string
 * @param {number} a - The lower limit of integration.
 * @param {number} b - The upper limit of integration.
 * @param {number} n - The number of subintervals.
 * @returns {number} - The approximate integral value.
 */
export function integral(func, min, max, n) {
    min = parseFloat(min);
    max = parseFloat(max);
    n = parseInt(n);

    if (n < 1) {
        throw new Error("The number of subintervals (n) must be greater than 0.");
    }

    const h = (max - min) / n; // width of each subinterval
    let sum = 0;
    
    for (let i = 1; i < n; i++) {
        const xMid = min + h * (i + 0.5); // midpoint of the subinterval
        try {
            sum += math.evaluate(func, {x : xMid});
        } catch (error) {
            throw new Error("Invalid function provided: " + error.message);
        }
    }

    return h * sum; // approximate area under the curve
}

/*
    test case
    const f = 'sin(x)'; // Function to integrate
    const a = 2; // Lower limit
    const b = 4; // Upper limit
    const n = 10000; // Number of subintervals

    try {
        const result = integral(f, a, b, n);
        console.log(`The area under the curve is approximately ${result}`);
    } catch (error) {
        console.error("Error:", error.message);
    }
*/
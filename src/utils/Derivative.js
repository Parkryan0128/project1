export function numericalDerivative(func) {
  let h = 0.001;
  return function (x) {
    return (func(x + h) - func(x - h)) / (2 * h);
  };
}

export function derivative(expressionOrFunc, xValue = null) {
  if (typeof expressionOrFunc === "string") {
    // Symbolic differentiation
    const derivativeExpr = differentiate(expressionOrFunc);
    if (xValue !== null) {
      // Evaluate the derivative expression at xValue
      return evaluateExpression(derivativeExpr, { x: xValue });
    }
    return derivativeExpr;
  } else if (typeof expressionOrFunc === "function") {
    // Numerical differentiation
    return numericalDerivative(expressionOrFunc);
  }
  throw new Error("Input must be either a string or a function.");
}

export function differentiate(expression) {
  // Convert the input to a string if it's not already
  if (typeof expression !== "string") {
    expression = String(expression);
  }

  // Normalize the expression by removing spaces
  expression = expression.replace(/\s+/g, "");

  // Handle Constants: c -> 0
  if (/^[-+]?\d+$/.test(expression)) {
    return "0"; // Derivative of a constant is always 0
  }

  // Handle Built-in Functions with the Chain Rule
  if (/^(sin|cos|ln|exp|tan|sqrt|sec|csc|cot)\(.*\)$/.test(expression)) {
    const [_, func, inner] = expression.match(
      /(sin|cos|ln|exp|tan|sqrt|sec|csc|cot)\((.*)\)/
    );
    const innerDerivative = differentiate(inner);

    switch (func) {
      case "sin":
        return `cos(${inner}) * (${innerDerivative})`;
      case "cos":
        return `-sin(${inner}) * (${innerDerivative})`;
      case "ln":
        return `1/(${inner}) * (${innerDerivative})`;
      case "exp":
        return `exp(${inner}) * (${innerDerivative})`;
      case "tan":
        return `sec(${inner})^2 * (${innerDerivative})`;
      case "sqrt":
        return `1/(2*sqrt(${inner})) * (${innerDerivative})`;
      case "sec":
        return `sec(${inner})*tan(${inner}) * (${innerDerivative})`;
      case "csc":
        return `-csc(${inner})*cot(${inner}) * (${innerDerivative})`;
      case "cot":
        return `-csc(${inner})^2 * (${innerDerivative})`;
      default:
        throw new Error(`Unsupported function: ${func}`);
    }
  }

  // Split the expression into individual terms
  const terms = expression.split(/[+-]/);

  // Differentiate each term
  const differentiatedTerms = terms.map((term) => {
    // Handle Constants: c -> 0
    if (/^[-+]?\d+$/.test(term)) {
      return "0";
    }

    // Handle Power Rule: x^n -> n*x^(n-1)
    if (/^x\^\d+$/.test(term)) {
      const [_, base, power] = term.match(/(x)\^(\d+)/);
      return `${power}*x^${power - 1}`;
    }

    // Handle Polynomial Terms: ax^n or ax
    if (/^[-+]?\d*\*?x(\^\d+)?$/.test(term)) {
      const coeff = term.match(/([-+]?\d*)\*?x/)[1];
      const power = term.includes("^") ? parseInt(term.split("^")[1], 10) : 1;
      const coefficient =
        coeff === "" || coeff === "+"
          ? 1
          : coeff === "-"
          ? -1
          : parseInt(coeff, 10);
      return power === 1
        ? `${coefficient}` // Linear term (e.g., 3x -> 3)
        : `${coefficient * power}*x^${power - 1}`; // Polynomial term
    }

    throw new Error(`Unsupported term: ${term}`);
  });

  // Join differentiated terms into a single expression
  return differentiatedTerms
    .filter((term) => term !== "0") // Remove terms that are zero
    .join(" + ")
    .replace(/\+\s-/g, "- "); // Fix formatting for negative terms
}

// Helper Function: Evaluate Expressions
export function evaluateExpression(expression, variables) {
  const sanitizedExpression = expression.replace(/\^/g, "**");
  let evaluatedExpression = sanitizedExpression;
  for (const key in variables) {
    const regex = new RegExp(`\\b${key}\\b`, "g");
    evaluatedExpression = evaluatedExpression.replace(regex, variables[key]);
  }
  return eval(evaluatedExpression);
}

// // Example Usage:
// console.log(derivative('x^2 + 3*x + 5')); // "2*x + 3"
// console.log(derivative('x^2 - 3*x + 5')); // "2*x + 3"
// const func = (x) => x ** 2 + 3 * x + 5;
// console.log(derivative(func)(2)); // Numerical derivative at x = 2
// console.log(derivative('x^2', 2));

// console.log(differentiate('x^2', 2));
// console.log(differentiate('x^2 + 3*x'));
// console.log(differentiate(1));

// console.log(differentiate("sin(x^2)")); // Output: "cos(x^2) * (2*x)"
// console.log(differentiate("ln(3*x)")); // Output: "1/(3*x) * 3"
// console.log(differentiate("exp(x^2 + 3*x)")); // Output: "exp(x^2 + 3*x) * (2*x + 3)"
// console.log(differentiate('sin(x)'));
// console.log(differentiate('cos(x)'));
// console.log(differentiate('tan(x)'));
// console.log(differentiate('sec(x)'));

// console.log(differentiate("ln(x)")); // "1/(x)"
// console.log(differentiate("csc(x)")); // "-csc(x)*cot(x)"
// console.log(differentiate("sec(x)")); // "sec(x)*tan(x)"
// console.log(differentiate("cot(x)")); // "-csc(x)^2"
// console.log(differentiate("ln(2*x)")); // "1/(2*x) * 2"
// console.log(differentiate("sec(x^2)")); // "sec(x^2)*tan(x^2) * (2*x)"
// console.log(differentiate("tan(x^2 + 3*x)")); // "sec(x^2 + 3*x)^2 * (2*x + 3)"

// console.log(differentiate("x")); // "1"
// console.log(differentiate("x + 1")); // "1 + 0"
// console.log(differentiate("x^2 + x + 1")); // "2*x + 1 + 0"
// console.log(differentiate("x^3 - x + 5")); // "3*x^2 - 1 + 0"
// // console.log(differentiate("sin(x) + cos(x)")); // "cos(x) - sin(x)"
// // console.log(differentiate("tan(x) - x")); // "sec(x)^2 - 1"
// // console.log(differentiate("ln(x) + x^2")); // "1/(x) + 2*x"
// console.log(differentiate("sec(x^2)")); // "sec(x^2)*tan(x^2) * (2*x)"

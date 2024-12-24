


export function latexToJs(latex) {
    try {
        let jsExpr = latex;

        // Replace LaTeX fractions with JS divisions
        jsExpr = jsExpr.replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1)/($2)');

        // Replace LaTeX square roots with Math.sqrt()
        jsExpr = jsExpr.replace(/\\sqrt{([^}]+)}/g, 'Math.sqrt($1)');

        // Replace LaTeX trigonometric functions with Math.* equivalents
        jsExpr = jsExpr.replace(/\\sin/g, 'Math.sin');
        jsExpr = jsExpr.replace(/\\cos/g, 'Math.cos');
        jsExpr = jsExpr.replace(/\\tan/g, 'Math.tan');

        // Replace constants
        jsExpr = jsExpr.replace(/\\pi/g, 'Math.PI');
        jsExpr = jsExpr.replace(/\\e/g, 'Math.E');

        // Replace exponents (^) with JS exponentiation (**)
        // Handle cases like x^2 or x^{2}
        jsExpr = jsExpr.replace(/(\w+)\^{([^}]+)}/g, '$1**($2)');
        jsExpr = jsExpr.replace(/(\w+)\^(\w+)/g, '$1**$2');

        // Replace multiplication symbols
        jsExpr = jsExpr.replace(/\\cdot/g, '*');

        // Remove braces
        jsExpr = jsExpr.replace(/[{}]/g, '');
        return jsExpr;
    } catch (error) {
        console.error('Error converting LaTeX to JS:', error);
        return null;
    }
}
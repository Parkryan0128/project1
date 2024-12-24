import React, { createContext, useState } from 'react';

export const GraphContext = createContext();

export const GraphProvider = ({ children }) => {
  const [equations, setEquations] = useState([
    {
      id: 1,
      expression: 'x',
      evaluate: (x) => x,
      color: '#f00',
    },
    // Add more equations as needed
  ]);

  const [scale, setScale] = useState({ x: 50, y: 50 }); // pixels per unit
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // panning offset

  const addEquation = (expression, color) => {
    // Parse the expression to create an evaluate function
    const evaluate = parseExpression(expression);
    setEquations([...equations, { id: Date.now(), expression, evaluate, color }]);
  };

  // Placeholder for expression parsing
  const parseExpression = (expr) => {
    // Implement a safe parser or use a library like math.js
    // For simplicity, using eval (not recommended for production)
    return (x) => {
      try {
        // eslint-disable-next-line no-new-func
        const func = new Function('x', `return ${expr};`);
        return func(x);
      } catch (error) {
        console.error('Invalid expression:', expr);
        return 0;
      }
    };
  };

  return (
    <GraphContext.Provider
      value={{
        equations,
        addEquation,
        scale,
        setScale,
        offset,
        setOffset,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};
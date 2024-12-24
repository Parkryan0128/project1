// import React from 'react'


// function Input() {
//   return <div>This is Input</div>
// }

// export default Input


import React, { useState } from 'react';

const LatexTest = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    // Function to translate LaTeX-like syntax to HTML
    const translateToHtml = (input) => {
        // Replace "^" for superscript
        input = input.replace(/(\w+)\^(\d+)/g, (match, base, exponent) => {
            return `${base}<span class="sup">${exponent}</span>`;
        });

        // Replace "_" for subscript
        input = input.replace(/(\w+)\_(\d+)/g, (match, base, subscript) => {
            return `${base}<span class="sub">${subscript}</span>`;
        });

        return input;
    };

    // Function to render LaTeX input
    const renderLatex = () => {
        const htmlOutput = translateToHtml(input);
        setOutput(htmlOutput);
    };

    return (
        <div>
            <h1>Enter a Math Expression:</h1>
            <input
                type="text"
                placeholder="e.g., x^2 + y_3"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={renderLatex}>Render</button>

            <h2>Output:</h2>
            <div
                className="latex-output"
                dangerouslySetInnerHTML={{ __html: output }}
            ></div>

            <style>
                {`
                    .latex-output {
                        font-family: "Times New Roman", Times, serif;
                        font-size: 20px;
                    }
                    .sup {
                        vertical-align: super;
                        font-size: smaller;
                    }
                    .sub {
                        vertical-align: sub;
                        font-size: smaller;
                    }
                `}
            </style>
        </div>
    );
};

export default LatexTest;

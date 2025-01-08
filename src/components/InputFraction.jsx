import React, { useState, useRef } from 'react'
import './InputFraction.css'

function InputList() {
    const [userInput, setUserInput] = useState([])
    const [isFocused, setIsFocused] = useState(false);

    const divRef = useRef(null);

    const handleFocus = () => {
        setIsFocused(true);

    };


    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleKeyDown = (e) => {
        e.preventDefault(); // Prevent default behavior (e.g., scrolling)
        
        const key = e.key;
        
        if (key.length === 1) {
          // If it's a printable character, add to inputs
          setUserInput((prev) => [...prev, key]);
        } else if (key === 'Backspace') {
          // Remove the last input
          setUserInput((prev) => prev.slice(0, -1));
        } else if (key === 'Enter') {
          // Handle Enter key (e.g., add a newline or perform an action)
          setUserInput((prev) => [...prev, '\n']);
        }
        // Add more key handlers as needed
      };

    let display = userInput.map(() => {
        return <span>
            x
        </span>
    })

    return <div
        ref={divRef}
        tabIndex={0} // Makes the div focusable
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
            border: isFocused ? '2px solid blue' : '1px solid gray',
            padding: '8px',
            minHeight: '40px',
            outline: 'none', // Removes default focus outline
        }}
        onKeyDown={handleKeyDown}
    >     
    {userInput.join('')}
    {isFocused && <span className="cursor">|</span>}


    </div>

}


export default InputList;
import React, { useState, useEffect } from 'react'
import './Input.css'

function Input() {
    let [values, setValues] = useState(['\u00A0'])
    let [focusedIndex, setFocusedIndex] = useState(null)

    function handleKeyPressed(e) {
        const temp = [...values]
        temp.splice(focusedIndex, 0, e.key)
        setValues([...temp])
        setFocusedIndex(focusedIndex + 1)
    }

    let display = values.map((value, index) => {
        return (
            <span
                className={`value
            ${value == '\u00A0' ? 'empty' : ''}
            ${index == focusedIndex ? 'focused' : ''}`}
                key={index}
                tabIndex={0}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                onKeyDown={(e) => handleKeyPressed(e)}>
                {value}
            </span>
        )
    })

    return (
        <div className="inputBox">
            {display}
        </div>
    )
}

// function Input() {
//     let [expression, setExpression] = useState(" ");
//     let [isFocused, setIsFocused] = useState(false);
//     let [showGraph, setShowGraph] = useState(true);
//     let [index, setIndex] = useState("1");

//     let hasValue = expression.trim() !== '';

//     return (
//         <div
//             className={`input ${isFocused ? 'focused' : ''}`}>
//             <div
//                 className={`onOff ${isFocused ? 'focused' : ''}`}>
//                 {index}
//                 <button
//                     className={`onOffButton
//                         ${hasValue ? '' : 'noValue'}
//                         ${showGraph ? '' : 'showGraphFalse'}`}
//                     onClick={() => setShowGraph(!showGraph)}>
//                 </button>
//             </div>
//             {expression}
//             <input
//                 className="userInput"
//                 value={expression}
//                 onChange={(e) => setExpression(e.target.value)}
//                 onFocus={() => setIsFocused(true)}
//                 onBlur={() => setIsFocused(false)}
//             />
//             <button className='deleteButton'>
//                 x
//             </button>
//         </div>
//     );
// }

export default Input
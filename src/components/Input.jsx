import React from 'react'
import './Input.css'
import { useState } from 'react'


function Input() {
    let [expression, setExpression] = useState(" ");
    let [isFocused, setIsFocused] = useState(false);
    let [showGraph, setShowGraph] = useState(true);
    let [index, setIndex] = useState("1");

    let hasValue = expression.trim() !== '';

    return (
        <div
            className={`input ${isFocused ? 'focused' : ''}`}>
            <div
                className={`onOff ${isFocused ? 'focused' : ''}`}>
                {index}
                <button
                    className={`onOffButton
                        ${hasValue ? '' : 'noValue'}
                        ${showGraph ? '' : 'showGraphFalse'}`}
                    onClick={() => setShowGraph(!showGraph)}>
                </button>
            </div>
            {expression}
            <input
                className="userInput"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            <button className='deleteButton'>
                x
            </button>
        </div>
    );
}

export default Input
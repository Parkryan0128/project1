import React from 'react'
import './Input.css'
import { useState } from 'react'


function Input() {
    let [expression, displayInput] = useState(" ");
    let [isFocused, setIsFocused] = useState(false);
    let [showGraph, setShowGraph] = useState(true);
    let [isAlive, setIsAlive] = useState(true);

    let hasValue = expression.trim() !== '';

    return (
        <div
            className={`Input ${isFocused ? 'focused' : ''}`}>
            <div
                className={`OnOff ${isFocused ? 'focused' : ''}`}>
                1
                <button
                    className={`OnOffButton 
                        ${hasValue ? '' : 'noValue'} 
                        ${showGraph ? '' : 'showGraphFalse'}`}
                    onClick={() => setShowGraph(!showGraph)}>
                </button>
            </div>
            {expression}
            <input
                className="UserInput"
                value={expression}
                onChange={(e) => displayInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}>
            </input>
            <button 
            className='deleteButton'
            onClick={() => setIsAlive(false)}>x</button>
        </div>
    );
}

export default Input
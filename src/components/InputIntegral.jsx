import React, { useState, useEffect } from 'react'
import './InputIntegral.css'

function InputIntegral() {
    // useStates
    let [userInput, setUserInput] = useState([
        { value: '\u00A0', type: 'empty' }
    ])
    let [type, setType] = useState(null)
    let [focusedIndex, setFocusedIndex] = useState(null)
    let [tempStr, setStr] = useState("")

    useEffect(() => {

        // in order to keep track of the focus when the span is clicked
        const focusedElement = document.querySelector('.focused')
        if (focusedElement) {
            focusedElement.focus()
        }
        console.log('focused index:', focusedIndex)
    }, [focusedIndex])

    // helper function acting as an indicator
    function funcIndicator(str) {
        const funcList = new Set(['int'])

        const normalizedStr = str.toLowerCase()

        return funcList.has(normalizedStr)
    }

    // calls this function everytime user presses key
    function handleKeyPressed(e) {

        // if keys pressed are numbers or operators
        if (/^[0-9+\-*/()]$/.test(e.key)) {
            const temp = [...userInput]
            const toAdd = { value: e.key, type: type }
            temp.splice(userInput.length - 1, 0, toAdd)
            setUserInput([...temp])
            setFocusedIndex(userInput.length)
            console.log(temp)
        }
        
        // if keys pressed are strings
        if (/^[a-zA-Z]$/.test(e.key)) {
            setStr(tempStr + e.key)
            const temp = [...userInput]
            const toAdd = { value: e.key, type: type }
            temp.splice(userInput.length - 1, 0, toAdd)
            setUserInput([...temp])
            setFocusedIndex(userInput.length)
            console.log(temp)
            console.log(tempStr)

            if (funcIndicator(tempStr)) {
                const temp = [...userInput]
                const toAdd = { value: tempStr, type: 'integral', upperBound: null, lowerBound: null }
                temp.splice(userInput.length - 1, 0, toAdd)
                setUserInput([...temp])
                setFocusedIndex(userInput.length)
                console.log(temp)
                console.log(tempStr)
            }
        }

        // deletes the existing userInput and focus the previous block
        if (e.key == "Backspace") {

        }
     }

    // span of for each block of the input
    let display = userInput.map(({ value, type }, index) => {
        
        if (type === 'integral') {
            return (
                <span
                className={`value 
                    ${type} 
                    ${index === focusedIndex ? 'focused' : ''}`}
                    key={index}
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyPressed(e)}
                    onClick={() => setFocusedIndex(index)}>
                    <big>∫</big>
                </span>
            )
        }

        return (
            <span 
            className={`value 
                ${type} 
                ${index === focusedIndex ? 'focused' : ''}`}
                key={index}
                tabIndex={0}
                onKeyDown={(e) => handleKeyPressed(e)}
                onClick={() => setFocusedIndex(index)}>
                {value}
            </span>
        )
    })

    return (
        <div
        className='inputBox'>
            {display}
        </div>
    )
}

export default InputIntegral
import React, { useState, useEffect, useReducer } from 'react'
import './InputIntegral.css'

function InputIntegral() {
    // useStates
    let [userInput, setUserInput] = useState([
        'cursor'
    ])
    let [processedInput, setprocessedInput] = useState([])
    let [type, setType] = useState(null)
    let [tempStr, setStr] = useState("")
    let [isFocused, setIsFocused] = useState(false)


    useEffect(() => {
        processInput(userInput)
        console.log(userInput)
        console.log(processedInput)
    }, [userInput])

    function insertAt(arr, index, ...item) {
        const copy = [...arr];
        for (let i = 0; i < item.length; i++)
            copy.splice(index, 0, item.reverse()[i]);
        return copy;
    }

    function swapItems(arr, i, j) {
        const copy = [...arr];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        return copy;
    }

    // helper function acting as an indicator
    function funcIndicator(str) {
        const funcList = new Set(['int'])

        const normalizedStr = str.toLowerCase()

        return funcList.has(normalizedStr)
    }

    // helper function to turn each user input to 
    // appropirate function type name for blocks
    function strToType(str) {
        const normalizedStr = str.toLowerCase()

        switch (normalizedStr) {
            case 'int': return 'integral'
        }
    }

    // calls this function everytime user presses key
    function handleKeyPressed(e) {
        e.preventDefault()
        const cursorIndex = userInput.indexOf('cursor')

        if (/^[a-zA-Z0-9+\-*()=/_]$/.test(e.key)) {

            if (userInput[cursorIndex] === 't', userInput[cursorIndex-1] === 'n', userInput[cursorIndex-2] === 'i') {
                let final = insertAt(userInput, cursorIndex, e.key)
                final = insertAt(final, cursorIndex+1, '(')
                final = insertAt(final, cursorIndex+2, ')')
                // final.splice(0, 2)
                setUserInput(final)
            } else {
                const updated = insertAt(userInput, cursorIndex, e.key)
                setUserInput(updated)
            }
        }

        // deletes the existing processedInput and focus the previous block
        if (e.key == "Backspace") {

        }

        if (e.key == 'ArrowLeft') {
            const updated = swapItems(userInput, cursorIndex-1, cursorIndex)
            setUserInput(updated)
        }

        if (e.key == 'ArrowRight') {
            const updated = swapItems(userInput, cursorIndex, cursorIndex+1)
            setUserInput(updated)
        }
        // if (e.key == '^') {
        //     let updated = insertAt(userInput, cursorIndex, e.key, '#', '$')
        //     const final = swapItems(updated, cursorIndex+2, cursorIndex+3)
        //     setUserInput(final)
        // }
     }


     function processInput(preprocessedInput) {
        const operators = ['+', '-', '*', '/']
        let arr = []
        let i = 0

        while (i < preprocessedInput.length) {
            if (userInput[i] === 'cursor') {
                arr.push({
                    type: 'cursor',
                    value: '\u00A0'
                })
            } else if (/^[a-zA-Z0-9+\-*()^=/_]+$/i.test(preprocessedInput[i])) {
                if (preprocessedInput[i] === 'i' && preprocessedInput[i+1] === 'n' && preprocessedInput[i+2] === 't'){
                    // arr.splice(i+1, 2) // I need to remove the 'i', 'n', 't' object and add 'int' block
                    arr.push({
                        type: 'integral',
                        value: [],
                        upperBound: [{type:'text', value:'a'}],
                        lowerBound: [{type:'text', value:'b'}]
                    })
                } else {
                    arr.push({
                        type: 'text',
                        value: userInput[i]
                    })
                    i++
                }
            } 
        }
        setprocessedInput(arr)
    }

    // function processInput(preprocessedInput) {
    //     const operators = ['+', '-', '*', '/']
    //     let arr = []

    //     for (let i = 0; i < preprocessedInput.length; i++) {
    //         if (userInput[i] === 'cursor') {
    //             arr.push({
    //                 type: 'cursor',
    //                 value: '\u00A0'
    //             })
    //         } else {
    //                 arr.push({
    //                     type: 'text',
    //                     value: userInput[i]
    //                 })
    //             }
    //         } 
    //     setprocessedInput(arr)
    // }

    function renderInput(input, parentIndex) {
        if (input.type === 'integral') {
            return (
            <div key={parentIndex}>
                <span
                className={`value
                    ${input.type}`}
                    tabIndex={0}
                    // onKeyDown={(e) => handleKeyPressed(e)}
                    // onClick={() => setFocusedIndex(parentIndex)}
                    >
                        <big>∫</big>
                </span>
                <span className='upper-bound'>
                    {input.upperBound.map((child, index) => renderInput(child,`${parentIndex}-upper-${index}`))}
                </span>
                <span className='lower-bound'>
                {input.lowerBound.map((child, index) => renderInput(child, `${parentIndex}-lower-${index}`))}
                </span>
            </div>
        )}
        return (
            <span
            className={`value
                ${input.type}`}
                key={parentIndex}
                tabIndex={0}
                onKeyDown={(e) => handleKeyPressed(e)}
                // onClick={() => setFocusedIndex(parentIndex)}
                >
                {input.value}
            </span>
        )
    }

    return (
        <div
        className='inputBox'>
            {processedInput.map((input, index) => renderInput(input, index))}
        </div>
    )
}

export default InputIntegral


// ${parentIndex === focusedIndex ? 'focused': ''}`
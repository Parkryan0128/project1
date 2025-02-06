import React, { useState, useEffect } from 'react'
import './InputIntegral.css'
import { index } from 'mathjs'

function InputIntegral() {

    // useStates
    let [userInput, setUserInput] = useState([
        'cursor'
    ])
    let [processedInput, setprocessedInput] = useState([])
    let [type, setType] = useState('text')
    let [tempStr, setStr] = useState("")
    let [isFocused, setIsFocused] = useState(false)


    useEffect(() => {
        let temp = processInput(userInput)
        setprocessedInput(temp)
        console.log(userInput)
        console.log(temp)
    }, [userInput])

    function insertAt(arr, index, item) {
        const copy = [...arr];
        copy.splice(index, 0, item);
        return copy;
    }

    function swapItems(arr, i, j) {
        const copy = [...arr];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        return copy;
    }

    function deleteAt(arr, index) {
        const copy = [...arr];
        copy.splice(index, 1);
        return copy;
    }

    function findParenPairs(str) {
        const stack = [];
        const pairs = [];

        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char.endsWith("OPEN_")) { // used to be char == "("
                // Push the index of the '(' onto the stack
                stack.push(i);
            } else if (char.endsWith("CLOSE_")) { // used to be char == ")"
                // Pop the last '(' from the stack (it matches this ')')
                const openIndex = stack.pop();
                // Record the pair of indexes
                pairs.push([openIndex, i]);
            }
            // Ignore any other characters
        }

        return pairs;
    }

    // calls this function everytime user presses key
    function handleKeyPressed(e) {
        e.preventDefault()
        let cursorIndex = userInput.indexOf('cursor')
        let copy = [...userInput]
        const pairs = findParenPairs(copy)

        if (/^[a-zA-Z0-9+\-*()=/]$/.test(e.key)) {

            if (e.key === 't' && copy[cursorIndex-1] === 'n' && copy[cursorIndex-2] === 'i') {
                let final = insertAt(copy, cursorIndex, e.key)
                final = insertAt(final, cursorIndex+1, '_INT_UPPER_BRACKET_OPEN_')
                final = insertAt(final, cursorIndex+2, 'cursor')
                final = insertAt(final, cursorIndex+3, '_INT_UPPER_BRACKET_CLOSE_')
                final = insertAt(final, cursorIndex+4, '_INT_LOWER_BRACKET_OPEN_')
                final = insertAt(final, cursorIndex+5, '_INT_LOWER_BRACKET_CLOSE_')
                final = insertAt(final, cursorIndex+6, '_INT_VALUE_BRACKET_OPEN_')
                final = insertAt(final, cursorIndex+7, '_INT_VALUE_BRACKET_CLOSE_')
                final.splice(cursorIndex+8, 1)
                setUserInput(final)
            } else {
                const updated = insertAt(copy, cursorIndex, e.key)
                setUserInput(updated)
            }
        }

        // deletes the existing processedInput and focus the previous block
        if (e.key == "Backspace") {
            
            // when backspace is pressed in value and it has no numbers in it,
            // then we move the cursor to the upperbound
            if (copy[cursorIndex-1] === '_INT_VALUE_BRACKET_OPEN_') {
                let final = insertAt(copy, copy.indexOf("_INT_UPPER_BRACKET_CLOSE_"), 'cursor')
                final.splice(cursorIndex+1, 1)
                setUserInput(final)
            } 
            // when backspace is pressed in upperbound and it has no numbers in it, 
            // then we remove the integral (as well as all the components; upperbound, 
            // lowerbound, and value)
            else if (copy[cursorIndex-1] === '_INT_UPPER_BRACKET_OPEN_') {

                let upperStart = cursorIndex - 1;
                let upperEnd;
                let lowerStart;
                let lowerEnd;
                let valueStart;
                let valueEnd;


                pairs.forEach((item) => {
                    if (item[0] === upperStart) {
                        upperEnd = item[1]
                        lowerStart = item[1] + 1
                    }
                })

                pairs.forEach((item) => {
                    if (item[0] === lowerStart) {
                        lowerEnd = item[1];
                        valueStart = item[1] + 1;
                    }
                })

                pairs.forEach((item) => {
                    if (item[0] === valueStart) {
                        valueEnd = item[1];
                    }
                })

                copy.splice(0, 3)
                copy = deleteAt(copy, upperStart-3)
                copy = deleteAt(copy, upperEnd-4)
                copy = deleteAt(copy, lowerStart-5)
                copy = deleteAt(copy, lowerEnd-6)
                copy = deleteAt(copy, valueStart-7)
                copy = deleteAt(copy, valueEnd-8)

                setUserInput(copy)
            } 
            // when backspace is pressed in lowerbound and it has no numbers in it,
            // then we remove the integral (as well as all the components) - same logic as upperbound
            else if (copy[cursorIndex-1] === '_INT_LOWER_BRACKET_OPEN_') {
                
            }

            else {
                copy.splice(cursorIndex-1, 1)
                setUserInput(copy)
            }
        }

        if (e.key == 'ArrowLeft') {
            const updated = swapItems(userInput, cursorIndex-1, cursorIndex)
            setUserInput(updated)
        }

        if (e.key == 'ArrowRight') {
            const updated = swapItems(userInput, cursorIndex, cursorIndex+1)
            setUserInput(updated)
        }
     }

    // function processInput() {
    //     let arr = []
    //     let i = 0
    //     let copy = [...userInput]
    //     const upper = []
    //     const lower = ''
    //     const value = ''

    //     while (i < copy.length) {
    //         if (copy[i] === 'cursor') {
    //             arr.push({
    //                 type: 'cursor',
    //                 value: '\u00A0'
    //             })
    //             i++;
    //         } else if (/^[a-zA-Z0-9+\-*()^=/_]+$/i.test(copy[i])) {
    //             if (copy[i] === 'i' && copy[i+1] === 'n' && copy[i+2] === 't') {


    //                 // need to extract all the values for the upperbound and lowerbound
    //                 // if (userInput[i+3] === '(') {

    //                 //     for (let k = 0; k < arr.length; k++) {
    //                 //         upper += arr[i+4+k]

    //                 //         if (userInput[i+4+k] === ')') {
    //                 //             i = i+5+k
    //                 //         }
    //                 //     }
    //                 // }

    //                 arr.push({
    //                     type: 'integral',
    //                     value: [],
    //                     upperBound: [{type:'text', value:'a'}],
    //                     lowerBound: [{type:'text', value:'b'}]
    //                 })
    //                 i += 3
    //                 // setType('upperBound')
    //             } else {
    //                 arr.push({
    //                     type: 'text',
    //                     value: copy[i]
    //                 })
    //                 i++
    //             }
    //         }
    //     }
    //     // setprocessedInput(arr)
    //     return arr
    // }

    function processInput(input) {
        let arr = []
        let i = 0
        let copy = [...input]

        const pairs = findParenPairs(copy)

        while (i < copy.length) {
            if (/^[a-zA-Z0-9+\-*()^=/_]+$/i.test(copy[i])) {
                if (copy[i] === 'i' && copy[i+1] === 'n' && copy[i+2] === 't') {

                    // looking for the closing brackets
                    let end;
                    pairs.forEach((item) => {
                        if (item[0] == i + 3) {
                            end = item[1]
                        }
                    })

                    const upper = copy.slice(i+4, end)
                    i = end + 1

                    pairs.forEach((item) => {
                        if (item[0] == i) {
                            end = item[1]
                        }
                    })

                    const lower = copy.slice(i+1, end)
                    i = end + 1

                    pairs.forEach((item) => {
                        if (item[0] == i) {
                            end = item[1]
                        }
                    })

                    const value = copy.slice(i+1, end)
                

                    arr.push({
                        type: 'integral',
                        value: processInput(value),
                        upperBound: processInput(upper),
                        lowerBound: processInput(lower)
                    })
                    i = end + 1;
                } else {
                    arr.push({
                        type: 'text',
                        value: copy[i]
                    })
                    i++
                }
            }
        }
        // setprocessedInput(arr)
        console.log("Processed Input: ", JSON.stringify(processedInput, null, 2));
        console.log(pairs)
        return arr
    }


    // function renderInput(input, parentIndex) {
    //     if (input.type === 'integral') {
    //         return (
    //         <div key={parentIndex}
    //         >
    //             <span
    //             className={`value
    //                 ${input.type}`}
    //                 tabIndex={0}
    //                 onKeyDown={(e) => handleKeyPressed(e)}
    //                 // onClick={() => setFocusedIndex(parentIndex)}
    //                 >
    //                     <big>∫</big>
    //             </span>
    //             <span className='upper-bound'>
    //                 {input.upperBound.map((child, index) => renderInput(child,`${parentIndex}-upper-${index}`))}
    //             </span>
    //             <span className='lower-bound'>
    //             {input.lowerBound.map((child, index) => renderInput(child, `${parentIndex}-lower-${index}`))}
    //             </span>
    //         </div>
    //     )}
    //     return (
    //         <span
    //         className={`value
    //             ${input.type}`}
    //             key={parentIndex}
    //             tabIndex={0}
    //             onKeyDown={(e) => handleKeyPressed(e)}
    //             // onClick={() => setFocusedIndex(parentIndex)}
    //             >
    //             {input.value}
    //         </span>
    //     )
    // }

    const renderInput = (list) => {

        return list.map((item, index) => {
            if (item.type == 'text') {
                return (
                    <span className='text' key={index}>{item.value}</span>
                );
            } else if (item.type == 'integral') {
                return (
                    <span className='integral' key={index}>
                        <span className='upper-bound'>{renderInput(item.upperBound)}</span>
                        <span className='integral-sign'>
                        <big>∫</big>
                        </span>
                        <span className='integral-value'>{renderInput(item.value)}</span>
                        <span className='lower-bound'>{renderInput(item.lowerBound)}</span>
                    </span>
                )
            }
        })
    }


    return (
        <div
        tabIndex={0}
        onKeyDown={handleKeyPressed}>
            {renderInput(processedInput)}
        </div>
    )
}

export default InputIntegral
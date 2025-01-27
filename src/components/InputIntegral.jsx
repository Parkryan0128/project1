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

    function findParenPairs(str) {
        const stack = [];
        const pairs = [];

        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char === '(') {
                // Push the index of the '(' onto the stack
                stack.push(i);
            } else if (char === ')') {
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
        const cursorIndex = userInput.indexOf('cursor')
        let copy = [...userInput]

        if (/^[a-zA-Z0-9+\-*()=/_]$/.test(e.key)) {

            if (e.key === 't' && copy[cursorIndex-1] === 'n' && copy[cursorIndex-2] === 'i') {
                let final = insertAt(copy, cursorIndex, e.key)
                final = insertAt(final, cursorIndex+1, '(')
                final = insertAt(final, cursorIndex+2, 'cursor')
                final = insertAt(final, cursorIndex+3, ')')
                final = insertAt(final, cursorIndex+4, '(')
                final = insertAt(final, cursorIndex+5, ')')
                final = insertAt(final, cursorIndex+6, '(')
                final = insertAt(final, cursorIndex+7, ')')
                // final = insertAt(final, cursorIndex+8, 'd')
                // final = insertAt(final, cursorIndex+9, 'x')
                final.splice(cursorIndex+8, 1)
                setUserInput(final)
            } else {
                const updated = insertAt(copy, cursorIndex, e.key)
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
        // const upper = []
        // const lower = []
        // const value = []

        const pairs = findParenPairs(copy)

        while (i < copy.length) {
            if (/^[a-zA-Z0-9+\-*()^=/_]+$/i.test(copy[i])) {
                if (copy[i] === 'i' && copy[i+1] === 'n' && copy[i+2] === 't') {

                    // looking for the closing brackets
                    let end;
                    pairs.forEach((item) => {
                        if (item[0] == i + 3) { //used to be item[0] == i
                            end = item[1]
                        }
                    })

                    const upper = copy.slice(i+4, end) // used to be nothing
                    i = end + 1

                    // for (let j=i+1; j <= end-1; j++) {
                    //     upper.push(copy[j])
                    // }

                    // i = end + 2

                    pairs.forEach((item) => {
                        if (item[0] == i) {
                            end = item[1]
                        }
                    })

                    const lower = copy.slice(i+1, end)

                    // for (let j=i+1; j<=end-1;j++) {
                    //     lower.push(copy[j])
                    // }
                

                    arr.push({
                        type: 'integral',
                        value: [],
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

    // const paintInput = (list) => {
    //     return list.map((item, index) => {
    //         if (item.type === 'text') {
    //             return (
    //                 <span key={index}>{item.value}</span>
    //             );
    //         } else {
    //             return (
    //                 <span className='integral' key={index}>
    //                     <span className='integral-sign'>
    //                         <big>∫</big>
    //                     </span>
    //                     <span className='upper-bound'>{paintInput(item.upperBound)}</span>
    //                     <span className='lower-bound'>{paintInput(item.lowerBound)}</span>
    //                 </span>
    //             );
    //         }
    //     })
    // }

    // function renderInput(item, index) {
    //     if (item.type === 'text') {
    //         return (
    //             <span key={index}>{item.value}</span>
    //         );
    //     } else if (item.type === 'integral') {
    //         return (
    //         <span className='integral' key={index}>
    //                     <span className='integral-sign'>
    //                         <big>∫</big>
    //                     </span>
    //                     <span className='upper-bound'>{item.upperBound.map((input, childIndex) => renderInput(input, childIndex))}</span> 
    //                     <span className='lower-bound'>{item.lowerBound.map((input, childIndex) => renderInput(input, childIndex))}</span>
    //                 </span>
    //         );
    //     }
    // }

    const renderInput = (list) => {
        return list.map((item, index) => {
            if (item.type == 'text') {
                return (
                    <span key={index}>{item.value}</span>
                );
            } else if (item.type == 'integral') {
                return (
                    <span className='integral' key={index}>
                        <span className='integral-sign'>
                        <big>∫</big>
                        </span>
                        <span className='upper-bound'>{renderInput(item.upperBound)}</span>
                        <span className='lower-bound'>{renderInput(item.lowerBound)}</span>
                    </span>
                )
            }
        })
    }

    //need to do another map on both upper-bound and lower-bound because they are array

    return (
        <div
        tabIndex={0}
        onKeyDown={handleKeyPressed}>
            {renderInput(processedInput)}
        </div>
    )
}

export default InputIntegral

// {/* {processedInput.map((input, index) => renderInput(input, index))} */}
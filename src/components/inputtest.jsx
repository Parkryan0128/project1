import React, { useState, useRef, useEffect } from 'react'
import './inputtest.css'
import '../utils/BEDMAS.js'
import { evaluteExpression } from '../utils/BEDMAS.js'

function Input() {
    let [userInput, setUserInput] = useState([])
    let [blocks, setBlocks] = useState([
        { value: '\u00A0', type: 'empty' },
    ])
    let [type, setType] = useState(null)
    let [focusedIndex, setFocusedIndex] = useState(null) // Track the focused block

    function handleKeyPressed(e) {
        handleUserInput(e)
        handleBlocks(e)
    }

    function updateFocusedIndex(newIndex) {
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= blocks.length) newIndex = blocks.length
        setFocusedIndex(newIndex)
    }

    useEffect(() => {
        const focusedElement = document.querySelector('.focused')
        if (focusedElement) {
            focusedElement.focus()
        }
        console.log('focused index: ', focusedIndex)
    }, [focusedIndex])

    // handles user input for calculation
    function handleUserInput(e) {
        if (/^[a-zA-Z0-9+\-*()^=/]$/.test(e.key)) {
            const temp = [...userInput]
            temp.push(e.key)
            setUserInput([...temp])
            console.log(temp)
        }

        if (e.key === "Backspace" && userInput.length > 0) {
            const temp = [...userInput]
            let numDelete = 1
            switch (temp[userInput.length - 1]) {
                case '^':
                    numDelete = 2
                    setType(null)
                    break;
                default:
                    break;
            }
            temp.splice(userInput.length - 1, numDelete)
            setUserInput([...temp])
            console.log(temp)
        }

        // calculation
        if (e.key == 'Enter' && userInput.length > 0) {
            console.log(evaluteExpression(userInput))
        }
    }

    // handles user input for display
    function handleBlocks(e) {
        if (/^[a-zA-Z0-9+\-*()=.]$/.test(e.key)) {
            const temp = [...blocks]
            const toAdd = { value: e.key, type: type }
            temp.splice(blocks.length - 1, 0, toAdd)
            // temp.splice(focusedIndex - 1, 0, toAdd)
            setBlocks([...temp])
            updateFocusedIndex(blocks.length)
            console.log(temp)
        }

        if (e.key == '^') {
            setType('exponent')
        }


        if (e.key == 'ArrowRight' && type == 'exponent') {
            setType(null)
        }

        // if (e.key == 'ArrowRight' && type == 'denominator') {
        //     setType(null)
        // }

        // if (e.key === "Backspace" && blocks.length > 1) {
        //     let temp = [...blocks]
        //     temp.splice(focusedIndex-1, 3)
        //     setBlocks([...temp])
        //     updateFocusedIndex(focusedIndex-1)
        //     console.log(temp)
        // } 

        if (e.key === "Backspace" && blocks.length > 1) {
            // let temp = [...blocks]
            blocks.splice(focusedIndex-1, 1)
            setBlocks(blocks)
            updateFocusedIndex(focusedIndex-1)
            console.log(blocks)
        } 

        // if (e.key === "Backspace") {
        //     e.preventDefault(); // Prevent default behavior
        //     if (blocks.length > 1) {
        //         setBlocks((prevBlocks) => {
        //             const temp = [...prevBlocks];
        //             temp.splice(temp.length - 2, 1); // Remove second-to-last element
        //             setFocusedIndex(blocks.length-2);
        //             return temp;
        //         });
        //         console.log(blocks);
        //     }
        // }
        

        if (e.key === "/" && type == null) {
            const temp = [...blocks].reverse().slice(1) // reverse and remove cursor
            const sliceIndex = [...temp].findIndex(block => !/^[a-zA-Z0-9.]$/.test(block.value));
            const sliced = sliceIndex === -1 ? temp : temp.slice(0, sliceIndex); // finds numerator
            const combinedBlock = [...sliced.reverse()].reduce(
                (acc, block) => ({
                    value: acc.value + block.value,
                    type: 'numerator',
                }),
                { value: '', type: 'numerator' }
            );
            const slicedBlocks = [...blocks].slice(0, blocks.length - (sliced.length + 1))
            setBlocks([...slicedBlocks, combinedBlock, { value: '\u00A0', type: 'denominator-empty' }])
            setType('denominator')
            console.log([...slicedBlocks, combinedBlock, { value: '\u00A0', type: 'denominator-empty' }])
        }
    }

    let display = blocks.map(({ value, type }, index) => {
        // while (type === 'denominator') {
        //     return (
        //         <span 
        //         className='value.denominator-empty'
        //         key={index}
        //         tabIndex={0}
        //         onKeyDown={(e) => handleKeyPressed(e)}>
        //             {value}
        //         </span>
        //     )
        // }
        if (type === 'numerator') {
            return (
                <span
                    className='fraction'
                    key={index}
                    tabIndex={0}>
                    <span
                        className={`value ${type}`}
                        key={index}
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyPressed(e)}
                    >
                        {value}
                    </span>
                    <span
                        className='value.denominator-empty'
                        key={index}
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyPressed(e)}>
                        {value}
                    </span>
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
                onClick={()=>updateFocusedIndex(index)}>
                {value}
            </span>
        )
    })

    return (
        <div
        className="inputBox">
            {display}
        </div>
    )
}


export default Input

// ${index == blocks.length - 1 ? 'focused' : ''}`}
import React, { useState } from 'react'
import './Input.css'

function Input() {
    let [userInput, setUserInput] = useState([])
    let [blocks, setBlocks] = useState([
        { value: '\u00A0', type: 'empty' },
    ])
    let [type, setType] = useState(null)

    function handleKeyPressed(e) {
        handleUserInput(e)
        handleBlocks(e)
    }


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
    }

    // handles user input for display
    function handleBlocks(e) {
        if (/^[a-zA-Z0-9+\-*()/=.\[\]]$/.test(e.key)) {
            const temp = [...blocks]
            const toAdd = { value: e.key, type: type }
            temp.splice(blocks.length - 1, 0, toAdd)
            setBlocks([...temp])
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

        if (e.key === "Backspace" && blocks.length > 1) {
            const temp = [...blocks]
            temp.splice(blocks.length - 2, 1)
            setBlocks([...temp])
            console.log(temp)
        }

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
        // if (type === 'numerator') {
        //     return (
        //         <span className='fraction'>
        //             <span
        //                 className={`value${type}`}
        //                 key={index}
        //                 tabIndex={0}>
        //                 {value}
        //             </span>
        //             <span>denominator</span>
        //         </span>
        //     )}
        return (
            <span
                className={`value
                    ${type}
                    ${index == blocks.length - 1 ? 'focused' : ''}`}
                key={index}
                tabIndex={0}
                onKeyDown={(e) => handleKeyPressed(e)}>
                {value}
            </span>
        )
    })
}

export default Input
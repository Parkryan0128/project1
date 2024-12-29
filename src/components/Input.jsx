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
        if (/^[a-zA-Z0-9+\-*()=.]$/.test(e.key)) {
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
                    ${index == blocks.length - 1 ? 'focused' : ''}`}
                key={index}
                tabIndex={0}
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

// tree demo

// function Input() {
//     const [values, setValues] = useState([
//         {
//             value: 'x', exponent: {
//                 value: '2', exponent: {
//                     value: '2', exponent: {
//                         value: '2', exponent: {
//                             value: '2', exponent: null
//                         }
//                     },
//                 },
//             },
//         }, {value: 's', exponent: null}
//     ])

//     const Display = ({ node }) => {
//         if (!node) return null;

//         return (
//             <span>
//                 {node.value}
//                 {node.exponent &&
//                     <sup>
//                         <Display node={node.exponent} />
//                     </sup>}
//             </span>
//         )
//     }

//     return <Display node={values[0]} />
// }

// left&right arrow added

// function Input() {
//     let [values, setValues] = useState(['\u00A0'])
//     let [focusedIndex, setFocusedIndex] = useState(null)
//     let [exponentMode, setExponentMode] = useState(false)
//     let component = useState(null)

//     function handleKeyPressed(e) {
//         if (/^[a-zA-Z0-9+\-*()^=]$/.test(e.key)) {
//             const temp = [...values]
//             temp.splice(focusedIndex, 0, e.key)
//             setValues([...temp])
//             setFocusedIndex(focusedIndex + 1)
//             console.log(temp)
//         }

//         if (e.key === "Backspace" && focusedIndex > 0) {
//             const temp = [...values]
//             temp.splice(focusedIndex - 1, 1)
//             setValues([...temp])
//             setFocusedIndex(focusedIndex - 1)
//             console.log(temp)
//         }

//         if (e.key === "^") {
//             setExponentMode(true)
//         }

//         if (e.key === "ArrowLeft" && focusedIndex > 0) {
//             setFocusedIndex(focusedIndex - 1)
//         }

//         if (e.key === "ArrowRight" && focusedIndex < values.length - 1) {
//             setFocusedIndex(focusedIndex + 1)
//         }

//         if (e.key === "ArrowRight" && exponentMode) {
//             // exponentMode = false
//             setExponentMode(false)
//         }
//     }

//     let display = values.map((value, index) => {
//         let isExponent = exponentMode && value !== '\u00A0';

//         if (value === '^') {
//             exponentMode = true
//             setExponentMode(true);
//             return <span key={index}/>;
//             // return <Input></Input>
//         }

//         return (
//             <span
//                 className={`value
//                     ${value == '\u00A0' ? 'empty' : ''}
//                     ${index == focusedIndex ? 'focused' : ''} 
//                     ${isExponent ? 'exponent' : ''}`}
//                 key={index}
//                 tabIndex={0}
//                 onFocus={() => setFocusedIndex(index)}
//                 onBlur={() => setFocusedIndex(null)}
//                 onKeyDown={(e) => handleKeyPressed(e)}>
//                 {value}
//             </span>
//         )
//     })

//     return (
//         <div className="inputBox">
//             {display}
//         </div>
//     )
// }

// Working input field taking all value

// function Input() {
//     let [values, setValues] = useState(['\u00A0'])
//     let [focusedIndex, setFocusedIndex] = useState(0)

//     function handleKeyPressed(e) {
//         if (/^[a-zA-Z0-9+\-*()^=]$/.test(e.key)) {
//             const temp = [...values]
//             temp.splice(focusedIndex, 0, e.key)
//             setValues([...temp])
//             setFocusedIndex(focusedIndex + 1)
//             console.log(temp)
//         }
//         if (e.key === "Backspace" && focusedIndex > 0) {
//             const temp = [...values]
//             temp.splice(focusedIndex - 1, 1)
//             setValues([...temp])
//             setFocusedIndex(focusedIndex - 1)
//             console.log(temp)
//         }
//     }

//     let display = values.map((value, index) => {
//         return (
//             <span
//                 className={`value
//                 ${value == '\u00A0' ? 'empty' : ''}
//                 ${index == focusedIndex ? 'focused' : ''}`}
//                 key={index}
//                 tabIndex={0}
//                 onFocus={() => setFocusedIndex(index)}
//                 onBlur={() => setFocusedIndex(null)}
//                 onKeyDown={(e) => handleKeyPressed(e)}>
//                 {value}
//             </span>
//         )
//     })

//     return (
//         <div className="inputBox">
//             {display}
//         </div>
//     )
// }

// first Input box with buttons

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
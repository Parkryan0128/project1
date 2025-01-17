import React, { useState, useRef, useEffect } from 'react'
import './Input.css'

function Input() {

    let [userInput, setUserInput] = useState([
        '1', '2', '+', 'x', '^', '#', '2', '^', '#', '2', '^', '#', '3', '+', '3', '$', '$', '+', '3', '$', 'cursor'
    ])

    let [objects, setObjects] = useState([
        { value: '1', type: 'default' },
        { value: '2', type: 'default' },
        { value: '+', type: 'default' },
        {
            value: 'x', type: 'exponent', exponent: [
                {
                    value: '2', type: 'exponent', exponent: [
                        {
                            value: '2', type: 'exponent', exponent: [
                                { value: '3', type: '' },
                                { value: '+', type: '' },
                                { value: '3', type: '' }
                            ]
                        }
                    ]
                },
                { value: '+', type: '' },
                { value: '3', type: '' }
            ]
        },
        { value: '\u00A0', type: 'cursor' }
    ])

    // let [userInput, setUserInput] = useState([
    //     '1', '2', '+', 'cursor'
    // ])

    // let [objects, setObjects] = useState([
    //     // { value: 'a', type: 'default' },
    //     // { value: '\u00A0', type: 'cursor' }
    // ])

    useEffect(() => {
        inputToObjects()
        console.log(userInput)
    }, [userInput])

    function inputToObjects() {
        // const inputType = 'default'
        // const res = []
        // userInput.map((item, index) => {
        //     if (item === 'cursor') {
        //         res.push({ value: '\u00A0', parentIndex: index, type: 'cursor' })
        //     } else if (/^[a-z0-9]+$/i.test(item)) {
        //         res.push({ value: item, parentIndex: index, type: { inputType }, })
        //     }
        // })
        // setObjects(res)
        // console.log(res)
    }

    // // function moveCursor(index) {
    // //     const temp = objects.filter((item) => item.type !== "cursor")
    // //     temp.splice(index, 0, { value: '', type: 'cursor' })
    // //     setObjects(temp)
    // // }

    // // handles user input for display
    // function handleKeyPressed(e, index) {
    //     // if (/^[a-zA-Z0-9+\-*()/=.\[\]]$/.test(e.key)) {
    //     //     const temp = [...userInput]
    //     //     const toAdd = { value: e.key, type: '' }
    //     //     temp.splice(index, 0, toAdd)
    //     //     setUserInput([...temp])
    //     //     console.log(temp)
    //     // }

    //     // if (e.key === 'ArrowLeft') {
    //     //     if (index > 0) {
    //     //         moveCursor(index - 1)
    //     //     }
    //     // }

    //     // if (e.key === 'ArrowRight') {
    //     //     if (index < userInput.length - 1) {
    //     //         moveCursor(index + 1)
    //     //     }
    //     // }

    //     // if (e.key === 'Backspace' && index > 0) {
    //     //     const temp = [...userInput];
    //     //     temp.splice(index - 1, 1)
    //     //     setUserInput([...temp]);
    //     //     console.log(temp);
    //     // }
    //     console.log(index)
    // }

    const Exponent = ({ node, fontSize = 40 }) => {
        if (!node) return null;

        if (Array.isArray(node)) {
            return node.map((child, index) => (
                <Exponent key={index} node={child} fontSize={fontSize * 0.8} />
            ))
        }

        if (node.type === 'cursor') {
            return (
                <span
                    className="value cursor"
                    ref={cursorRef}
                    tabIndex={0}
                    onKeyDown={handleKeyPressed}
                    style={{ fontSize: `${fontSize}px` }}>
                    {'\u200B'}
                </span>
            )
        }

        return (
            <span style={{ fontSize: `${fontSize}px` }}>
                {node.value}
                {node.exponent && (
                    <sup>
                        <Exponent node={node.exponent} fontSize={fontSize * 0.9} />
                    </sup>
                )}
            </span>
        )
    }

    const Display = objects.map((item) => {
        if (item.type === 'cursor') {
            return (
                <span
                    className="cursor"
                    key={item.parentIndex}>
                    {item.value}
                </span>
            )
        }

        if (item.type === 'exponent') {
            return (
                <Exponent node={item} />
            )
        }

        return (
            <span
                className='value'
                key={item.parentIndex}>
                {item.value}
            </span>
        )
    })

    return (
        <div className="inputBox">
            {Display}
        </div>
    )
}

export default Input
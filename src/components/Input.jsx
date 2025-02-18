import React, { useState, useEffect } from 'react'
import './Input.css'

const SQUARE_ROOT_OPEN = "__SQUARE_ROOT_OPEN__";
const SQUARE_ROOT_CLOSE = "__SQUARE_ROOT_CLOSE__";
const CURSOR = 'cursor';
const EMPTY_SQUARE_ROOT = '__EMPTY_SQUARE_ROOT__'

function Input() {
    const [userInput, setUserInput] = useState([CURSOR]);
    const [isFocused, setIsFocused] = useState(false);
    const [processedInput, setProcessedInput] = useState([]);

    useEffect(() => {
        let temp = processInput(userInput)
        setProcessedInput(temp)
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

    function findMatchingSquareRootClose(array, openIndex) {
        let openBrackets = 1;
        let index = openIndex + 1;
    
        while (index < array.length && openBrackets > 0) {
            if (array[index] === SQUARE_ROOT_OPEN) {
                openBrackets++;
            } else if (array[index] === SQUARE_ROOT_CLOSE) {
                openBrackets--;
            }
            index++;
        }
    
        return openBrackets === 0 ? index - 1 : -1;
    }
    
    function handleCharPress(arr, cursorIndex, item) {
        arr = insertAt(arr, cursorIndex, item);
        return arr;
    }

    function handleArrowLeft(arr, cursorIndex) {
        if (cursorIndex > 0) { // cursor can't move left if it is at index 0
            if (arr[cursorIndex - 1] == SQUARE_ROOT_OPEN) {
                arr = swapItems(arr, cursorIndex, cursorIndex - 1);
                arr = swapItems(arr, cursorIndex - 1, cursorIndex - 2);
                if (arr[cursorIndex + 1] == SQUARE_ROOT_CLOSE) {
                    arr = insertAt(arr, cursorIndex + 1, EMPTY_SQUARE_ROOT);
                }
            } else {
                arr = swapItems(arr, cursorIndex, cursorIndex - 1);
                if (arr[cursorIndex] == SQUARE_ROOT_CLOSE && 
                    arr[cursorIndex - 2] == EMPTY_SQUARE_ROOT) {
                    arr = deleteAt(arr, cursorIndex - 2)
                }
            }
        }
        return arr;
    }

    function handleArrowRight(arr, cursorIndex) {
        if (cursorIndex < arr.length - 1) {
            if (userInput[cursorIndex + 1] == '√') {
                arr = swapItems(arr, cursorIndex, cursorIndex + 1);
                arr = swapItems(arr, cursorIndex + 1, cursorIndex + 2);
                if (arr[cursorIndex + 3] == EMPTY_SQUARE_ROOT) {
                    arr = deleteAt(arr, cursorIndex + 3)
                }
            } else {
                arr = swapItems(arr, cursorIndex, cursorIndex + 1);
                if (arr[cursorIndex] == SQUARE_ROOT_CLOSE && 
                    arr[cursorIndex - 1] == SQUARE_ROOT_OPEN) {
                    arr = insertAt(arr, cursorIndex, EMPTY_SQUARE_ROOT)
                }
            }
        }
        return arr;
    }

    function handleBackspace(arr, cursorIndex) {
        if (cursorIndex > 0) {
            if (arr[cursorIndex - 1] == SQUARE_ROOT_OPEN || arr[cursorIndex - 1] == SQUARE_ROOT_CLOSE) {
                if (arr[cursorIndex - 1] == SQUARE_ROOT_OPEN) {
                    let closingIndex = findMatchingSquareRootClose(arr, cursorIndex - 1)

                    arr = deleteAt(arr, cursorIndex - 2)
                    arr = deleteAt(arr, cursorIndex - 2)
                    arr = deleteAt(arr, closingIndex - 2)
                } else if (arr[cursorIndex - 1] == SQUARE_ROOT_CLOSE) {
                    arr = swapItems(arr, cursorIndex, cursorIndex - 1);
                    if (arr[cursorIndex - 2] == EMPTY_SQUARE_ROOT) {
                        arr = deleteAt(arr, cursorIndex)
                        arr = deleteAt(arr, cursorIndex - 4)
                        arr = deleteAt(arr, cursorIndex - 4)
                        arr = deleteAt(arr, cursorIndex - 4)
                    }
                }
            } else {
                arr = deleteAt(arr, cursorIndex - 1)
            }
        }
        return arr;
    }

    function isSqrtPressed(arr, cursorIndex) {
        let i = cursorIndex;
        return arr[i - 3] == 's' && arr[i - 2] == 'q' && arr[i - 1] == 'r'
    }

    function handleSqrtPressed(arr, cursorIndex) {
        arr = deleteAt(arr, cursorIndex - 3);
        arr = deleteAt(arr, cursorIndex - 3);
        arr = deleteAt(arr, cursorIndex - 3);
        arr = insertAt(arr, cursorIndex - 3, '√');
        arr = insertAt(arr, cursorIndex - 2, SQUARE_ROOT_OPEN);
        arr = insertAt(arr, cursorIndex, SQUARE_ROOT_CLOSE);
        return arr;
    }

    const handleKeyDown = (e) => {
        e.preventDefault();

        const key = e.key;
        let copy = [...userInput];
        const cursorIndex = copy.indexOf(CURSOR);

        if (key.length === 1) {
            if (key === 't' && isSqrtPressed(copy, cursorIndex)) {
                copy = handleSqrtPressed(copy, cursorIndex);
            } else {
                copy = handleCharPress(copy, cursorIndex, key);
            }
        }
        else if (key === 'ArrowLeft') {
            copy = handleArrowLeft(copy, cursorIndex);
        }
        else if (key === 'ArrowRight') {
            copy = handleArrowRight(copy, cursorIndex);
        }
        else if (key === 'Backspace') {
            copy = handleBackspace(copy, cursorIndex);
        }

        setUserInput(copy);
    };

    function findBase(array) {
        let temp = [...array]
        let i = temp.length - 1
        let res = []

        if (temp[i] == ')') {
            while (i >= 0 && temp[i] != '(') {
                const next = temp[i]
                // res = next + res
                res.splice(0, 0, next)
                i--
            }
            res = '(' + res;
        } else {
            while (i >= 0 && temp[i] != ')' && temp[i] != SQUARE_ROOT_CLOSE) {
                const next = temp[i]
                // res = next + res
                res.splice(0, 0, next)
                i--
            }
        }
        return res
    }

    function findChildren(array) {
        let copy = [...array];
        let res = [];
        let i = 1;
        let count = 1;

        res.push(copy[0])

        while (count > 0) {
            let curr = copy[i]
            if (curr == SQUARE_ROOT_OPEN) {
                count++;
            }
            if (curr == SQUARE_ROOT_CLOSE) {
                count--;
            }
            res.push(curr)
            i++
        }
        return res;
    }

    function findRadicand(arr) {
        let res = []
        let closeIndex = findMatchingSquareRootClose(arr, 0)

        for (let i = 1; i < closeIndex; i++) {
            res.push(arr[i])
        }

        return res;
    }

    function processInput(array) {
        let res = []
        let i = 0
        let temp = [...array]

        while (i < temp.length) {
            if (temp[i] == CURSOR) {
                res.push({type : 'cursor'})
                i++
            } else if (temp[i] == EMPTY_SQUARE_ROOT) {
                res.push({type : 'empty_square_root'})
                i++
            } else if (/^[a-z0-9()+*-]+$/i.test(array[i])) {
                res.push({
                    type: 'text',
                    value: array[i]
                })
                i++;
            } else if (temp[i] == '√') {
                let closeIndex = findMatchingSquareRootClose(temp, i + 1)
                let jumpIndex = closeIndex - i;

                let radicand = processInput(findRadicand([...temp].slice(i + 1)))

                res.push({
                    type: 'square-root',
                    value: radicand
                })

                i = i + jumpIndex + 1;
            } else {
                i++;
            }
        }
        return res;
    }

    // Recursively render the nested structure from processedinput
    function displayText(nodeList) {
        return nodeList.map((node, index) => {
            switch (node.type) {
                case 'text':
                    return <span key={index}>{node.value}</span>;

                case 'fraction':
                    return (
                        <span className="fraction" key={index}>
                            <span className="numerator">{displayText(node.numerator)}</span>
                            <span className="fraction-bar" />
                            <span className="denominator">{displayText(node.denominator)}</span>
                        </span>
                    );

                case 'exponent':
                    return (
                        <span key={index}>
                            <span>{displayText(node.value)}</span>
                            <sup>
                                <span>{displayText(node.children)}</span>
                            </sup>
                        </span>
                    );

                case 'square-root':
                    return (
                        <span key={index} className = "square-root">
                            <span>√</span>
                            <span>(</span>
                            <span className='radicand'>{displayText(node.value)}</span>
                            <span>)</span>
                        </span>
                    );
                case 'empty_square_root' :
                    return (
                        <span key={index} className="empty-square-root"/>
                    );

                case 'cursor':
                    return (
                        <span key={index} className="blink-cursor">
                            |
                        </span>
                    );

                default:
                    return null;
            }
        });
    }

    return (
        <div
            tabIndex={0}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            style={{
                border: isFocused ? '2px solid blue' : '1px solid gray',
                padding: '8px',
                minHeight: '40px',
                outline: 'none',
            }}
        >
            {displayText(processedInput)}
        </div>
    );
}

export default Input;
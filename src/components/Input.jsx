import React, { useState, useEffect } from 'react'
import './Input.css'

// value is one of '(' or ')' and type is one of 'base' or 'child'
class ExponentBracket {
    constructor(value, type) {
        this.value = value;
        this.type = type;
    }
}

function Input() {
    const [userInput, setUserInput] = useState(['cursor']);
    const [isFocused, setIsFocused] = useState(false);
    const [processedInput, setProcessedInput] = useState([]);

    useEffect(() => {
        let temp = processInput(userInput)
        setProcessedInput(temp)
    }, [userInput])

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

    const handleFocus = () => {
        setIsFocused(true);
    }

    const handleBlur = () => {
        setIsFocused(false);
        // If you want to finalize fraction editing on blur, you could do so here.
    }

    function insertAt(arr, index, item) {
        const copy = [...arr];
        copy.splice(index, 0, item);
        return copy;
    }

    // Helper: Swap items at two indexes (immutable)
    function swapItems(arr, i, j) {
        const copy = [...arr];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        return copy;
    }

    const handleKeyDown = (e) => {
        e.preventDefault(); // Prevent default browser behavior
        const key = e.key;
        const cursorIndex = userInput.indexOf('cursor');

        if (key == '^' && userInput.length > 1 && !(userInput[cursorIndex - 1] instanceof ExponentBracket)) {

            const copy = [...userInput];
            const limit = ['+', '-']

            let i = cursorIndex;

            if (copy[i - 1] == ')') {
                while (i >= 0 && copy[i] != '(') {
                    i--;
                }
                i--;
            } else {
                while (i >= 0 && !limit.includes(copy[i]) && !(copy[i] instanceof ExponentBracket)) {
                    i--;
                }
            }

            console.log(i)

            copy.splice(i + 1, 0, new ExponentBracket('(', 'base'))
            copy.splice(cursorIndex + 1, 0, new ExponentBracket(')', 'base'))
            copy.splice(cursorIndex + 2, 0, '^')
            copy.splice(cursorIndex + 3, 0, new ExponentBracket('(', 'child'))
            copy.splice(cursorIndex + 5, 0, new ExponentBracket(')', 'child'))
            setUserInput(copy)
        }

        else if (key.length === 1 && key != '^') {
            // Insert the new char right BEFORE the cursor
            const updated = insertAt(userInput, cursorIndex, key);
            setUserInput(updated);
            return;
        }

        // 2. Left arrow: move 'cursor' left if possible
        else if (key === 'ArrowLeft') {
            if (cursorIndex > 0) {
                // Swap the cursor with the item to its left
                let updated = []
                if (userInput[cursorIndex - 1] instanceof ExponentBracket &&
                    userInput[cursorIndex - 1].value === '(' &&
                    userInput[cursorIndex - 1].type === 'child') {
                    updated = swapItems(userInput, cursorIndex, cursorIndex - 1);
                    updated = swapItems(updated, cursorIndex - 1, cursorIndex - 2);
                    updated = swapItems(updated, cursorIndex - 2, cursorIndex - 3);
                    // } 
                    // else if (userInput[cursorIndex - 1] instanceof ExponentBracket &&
                    //     userInput[cursorIndex - 1].value === '(' &&
                    //     userInput[cursorIndex - 1].type === 'base') {
                } else {
                    updated = swapItems(userInput, cursorIndex, cursorIndex - 1);
                }
                console.log(updated)
                setUserInput(updated);
            }
            return;
        }

        // 3. Right arrow: move 'cursor' right if possible
        else if (key === 'ArrowRight') {
            if (cursorIndex < userInput.length - 1) {
                // Swap the cursor with the item to its right
                let updated = []
                if (userInput[cursorIndex + 1] instanceof ExponentBracket &&
                    userInput[cursorIndex + 1].value === ')' &&
                    userInput[cursorIndex + 1].type === 'base') {
                    updated = swapItems(userInput, cursorIndex, cursorIndex + 1);
                    updated = swapItems(updated, cursorIndex + 1, cursorIndex + 2);
                    updated = swapItems(updated, cursorIndex + 2, cursorIndex + 3);
                } else {
                    updated = swapItems(userInput, cursorIndex, cursorIndex + 1);
                }
                setUserInput(updated);
            }
            return;
        }

        else if (key == 'Backspace') {
            if (cursorIndex > 0) {
                const copy = [...userInput];
                if (copy[cursorIndex - 1] instanceof ExponentBracket) {
                    if (copy[cursorIndex - 1].value === '(' && copy[cursorIndex - 1].type === 'child') {
                        let closingIndex = findMatchingBracket(copy, cursorIndex, 'child', 'opening');
                        copy.splice(closingIndex, 1);

                        copy.splice(cursorIndex - 1, 1);
                        copy.splice(cursorIndex - 2, 1);
                        copy.splice(cursorIndex - 3, 1);

                        let baseClosingIndex = findMatchingBracket(copy, cursorIndex - 3, 'base', 'closing');
                        copy.splice(baseClosingIndex, 1);

                        setUserInput(copy);
                    } else if (copy[cursorIndex - 1].value === ')' && copy[cursorIndex - 1].type === 'child') {
                        const updated = swapItems(copy, cursorIndex, cursorIndex - 1);
                        setUserInput(updated);
                    }
                } else {
                    copy.splice(cursorIndex - 1, 1);
                    setUserInput(copy);
                }
            }
        }
    }

    function findMatchingBracket(array, startIndex, type, direction) {
        let openBrackets = 1;
        let index = startIndex;
    
        if (direction === 'opening') {
            while (index < array.length && openBrackets > 0) {
                index++;
                if (array[index] instanceof ExponentBracket) {
                    if (array[index].value === '(' && array[index].type === type) {
                        openBrackets++;
                    } else if (array[index].value === ')' && array[index].type === type) {
                        openBrackets--;
                    }
                }
            }
        } else if (direction === 'closing') {
            while (index >= 0 && openBrackets > 0) {
                index--;
                if (array[index] instanceof ExponentBracket) {
                    if (array[index].value === '(' && array[index].type === type) {
                        openBrackets--;
                    } else if (array[index].value === ')' && array[index].type === type) {
                        openBrackets++;
                    }
                }
            }
        }
    
        return index;
    }

    function findBase(array) {
        let temp = [...array]
        let i = temp.length - 2
        let res = ''

        while (i >= 0 && !(temp[i] instanceof ExponentBracket)) {
            const next = temp[i]
            res = next + res
            i--
        }

        console.log(res)
        return res
    }

    function findChildren(array) {
        let copy = [...array];
        let res = [];
        let openBrackets = 0;

        for (let i = 0; i < copy.length; i++) {
            const next = copy[i];

            if (next instanceof ExponentBracket && next.type === 'child' && next.value === '(') {
                openBrackets++;
            }

            res.push(next);

            if (next instanceof ExponentBracket && next.type === 'child' && next.value === ')') {
                openBrackets--;
                if (openBrackets === 0) {
                    break;
                }
            }
        }

        return res;
    }

    function removeElements(array, index, numElements) {
        let i = index - 1
        while (numElements > 0 && i >= 0) {
            array.splice(i, 1)
            i--
            numElements--
        }

        return array
    }

    function processInput(array) {
        let res = []
        let i = 0
        let temp = [...array]

        while (i < temp.length) {
            if (/^[a-z0-9()]+$/i.test(array[i])) {
                res.push({
                    type: 'text',
                    value: array[i]
                })
                i++;
            } else if (temp[i] == '^') {
                let base = findBase([...temp].slice(0, i)) // returns base as string
                let children_0 = processInput(findChildren([...temp].slice(i + 1))) // returns children of the exponent by recursion

                res.splice(res.length - base.length, base.length)

                res.push({
                    type: 'exponent',
                    value: base,
                    children: children_0
                })

                console.log(findChildren([...temp].slice(i + 1)))

                i += findChildren([...temp].slice(i + 1)).length;
            } else {
                i++;
            }
        }

        console.log(userInput)
        console.log(res);
        return res;
    }

    const Exponent = ({ node, fontSize = 16 }) => {
        if (!node) return null;

        if (Array.isArray(node)) {
            return node.map((child, index) => (
                <Exponent key={index} node={child} fontSize={fontSize * 0.8} />
            ))
        }

        return (
            <span style={{ fontSize: `${fontSize}px` }}>
                {node.value}
                {node.children && (
                    <sup>
                        <Exponent node={node.children} fontSize={fontSize * 0.9} />
                    </sup>
                )}
            </span>
        )
    }

    // Render the userInput
    const display = processedInput.map((item, index) => {
        if (item.type === 'text') {
            return (
                <span key={index}>{item.value}</span>
            );
        } else if (item.type === 'exponent') {
            return (
                <Exponent key={index} node={item} />
            )
        } else {
            // Fraction node
            return (
                <span className="fraction" key={index}>
                    <span className="numerator">{item.numerator || ' '}</span>
                    <span className="fraction-bar" />
                    <span className="denominator">{item.denominator || ' '}</span>
                </span>
            )
        }
    })

    return (
        <div
            tabIndex={0}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
                border: isFocused ? '2px solid blue' : '1px solid gray',
                padding: '8px',
                minHeight: '40px',
                outline: 'none', // Removes default focus outline
            }}
        >
            {display}
            {/* {isFocused && <span className="cursor">|</span>} */}
        </div>
    );
}

export default Input;
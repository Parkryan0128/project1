import React, { useState, useEffect } from 'react'
import './Input.css'

const EXPONENT_OPEN = "__EXPONENT_OPEN__";
const EXPONENT_CLOSE = "__EXPONENT_CLOSE__";
const CURSOR = 'cursor';

function Input() {
    const [userInput, setUserInput] = useState(['cursor']);
    const [isFocused, setIsFocused] = useState(false);
    const [processedInput, setProcessedInput] = useState([]);

    useEffect(() => {
        let temp = processInput(userInput)
        setProcessedInput(temp)
        console.log(userInput)
        console.log(temp)
    }, [userInput])

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
        e.preventDefault();
        const key = e.key;
        const cursorIndex = userInput.indexOf('cursor');
        const testValid = /^[a-z0-9()]+$/i.test(userInput[cursorIndex - 1]);

        if (key == '^' && cursorIndex >= 1 && testValid) {
            if (userInput[cursorIndex + 1] == '^') {
                let updated = []
                updated = swapItems(userInput, cursorIndex, cursorIndex + 1);
                updated = swapItems(updated, cursorIndex + 1, cursorIndex + 2);
                if (userInput[cursorIndex + 3] == 'empty') {
                    updated.splice(cursorIndex + 3, 1);
                }
                setUserInput(updated)
                return
            }
            const copy = [...userInput];

            copy.splice(cursorIndex, 0, '^')
            copy.splice(cursorIndex + 1, 0, EXPONENT_OPEN)
            copy.splice(cursorIndex + 3, 0, EXPONENT_CLOSE)
            setUserInput(copy)
        }

        else if (key.length === 1 && key != '^') {
            const updated = insertAt(userInput, cursorIndex, key);
            setUserInput(updated)
            return;
        }

        else if (key === 'ArrowLeft') {
            if (cursorIndex > 0) {
                let updated = []
                if (userInput[cursorIndex - 1] == EXPONENT_OPEN) {
                    updated = swapItems(userInput, cursorIndex, cursorIndex - 1);
                    updated = swapItems(updated, cursorIndex - 1, cursorIndex - 2);
                    if (userInput[cursorIndex + 1] == EXPONENT_CLOSE) {
                        updated.splice(cursorIndex + 1, 0, 'empty');
                    }
                } else {
                    updated = swapItems(userInput, cursorIndex, cursorIndex - 1);
                    if (userInput[cursorIndex - 1] == EXPONENT_CLOSE && 
                        userInput[cursorIndex - 2] == 'empty') {
                        updated.splice(cursorIndex - 2, 1);
                    }
                }
                setUserInput(updated);
            }
            return;
        }

        else if (key === 'ArrowRight') {
            if (cursorIndex < userInput.length - 1) {
                let updated = []
                if (userInput[cursorIndex + 1] == '^') {
                    updated = swapItems(userInput, cursorIndex, cursorIndex + 1);
                    updated = swapItems(updated, cursorIndex + 1, cursorIndex + 2);
                    if (userInput[cursorIndex + 3] == 'empty') {
                        updated.splice(cursorIndex + 3, 1);
                    }
                } else {
                    updated = swapItems(userInput, cursorIndex, cursorIndex + 1);
                    if (userInput[cursorIndex + 1] == EXPONENT_CLOSE && userInput[cursorIndex - 1] == EXPONENT_OPEN) {
                        updated.splice(cursorIndex, 0, 'empty');
                    }
                }
                setUserInput(updated);
            }
            return;
        }

        else if (key == 'Backspace') {
            if (cursorIndex > 0) {
                const copy = [...userInput];
                
                if (copy[cursorIndex - 1] == EXPONENT_OPEN || copy[cursorIndex - 1] == EXPONENT_CLOSE) {
                    if (copy[cursorIndex - 1] == EXPONENT_OPEN) {
                        let closingIndex = findMatchingExponentClose(userInput, cursorIndex - 1)

                        copy.splice(cursorIndex - 2, 1);
                        copy.splice(cursorIndex - 2, 1);
                        copy.splice(closingIndex - 2, 1);

                        setUserInput(copy);
                    } else if (copy[cursorIndex - 1] == EXPONENT_CLOSE) {
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

    function findMatchingExponentClose(array, openIndex) {
        let openBrackets = 1;
        let index = openIndex + 1;
    
        while (index < array.length && openBrackets > 0) {
            if (array[index] === EXPONENT_OPEN) {
                openBrackets++;
            } else if (array[index] === EXPONENT_CLOSE) {
                openBrackets--;
            }
            index++;
        }
    
        return openBrackets === 0 ? index - 1 : -1;
    }

    function findBase(array) {
        let temp = [...array]
        let i = temp.length - 1
        let res = ''

        if (temp[i] == ')') {
            while (i >= 0 && temp[i] != '(') {
                const next = temp[i]
                res = next + res
                i--
            }
            res = '(' + res;
        } else {
            while (i >= 0 && temp[i] != ')' && temp[i] != EXPONENT_CLOSE) {
                const next = temp[i]
                res = next + res
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
            if (curr == EXPONENT_OPEN) {
                count++;
            }
            if (curr == EXPONENT_CLOSE) {
                count--;
            }
            res.push(curr)
            i++
        }
        return res;
    }

    function processInput(array) {
        let res = []
        let i = 0
        let temp = [...array]

        while (i < temp.length) {
            if (/^[a-z0-9()+*]+$/i.test(array[i])) {
                res.push({
                    type: 'text',
                    value: array[i]
                })
                i++;
            } else if (temp[i] == '^') {
                let base = findBase([...temp].slice(0, i))
                let children_0 = processInput(findChildren([...temp].slice(i + 1)))
                console.log(base)
                console.log(children_0)

                res.splice(res.length - base.length, base.length)

                res.push({
                    type: 'exponent',
                    value: base,
                    children: children_0
                })

                i += findChildren([...temp].slice(i + 1)).length;
            } else {
                i++;
            }
        }
        return res;
    }

    // exponent component using recursion. Manually change the font size of base
    const Exponent = ({ node, fontSize = 16 }) => {
        if (!node) return null;

        if (Array.isArray(node)) {
            return node.map((child, index) => (
                <Exponent key={index} node={child} fontSize={fontSize * 0.9} />
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
                outline: 'none',
            }}
        >
            {display}
        </div>
    );
}

export default Input;
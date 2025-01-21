import React, { useState, useEffect } from 'react'
import './Input.css'

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
    };

    const handleBlur = () => {
        setIsFocused(false);
        // If you want to finalize fraction editing on blur, you could do so here.
    };

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

        if (key == '^' && userInput.length > 1) {

            const copy = [...userInput];
            const limit = ['+', '-', '(', ')']

            let i = cursorIndex;
            while (i >= 0 && !limit.includes(copy[i])) {
                i--;
            }
            copy.splice(i + 1, 0, '(');
            copy.splice(cursorIndex + 2, 0, ')')
            copy.splice(cursorIndex + 1, 0, '(')
            copy.splice(cursorIndex + 1, 0, '^')
            copy.splice(cursorIndex + 1, 0, ')')
            console.log(copy)
            setUserInput(copy)
        }

        else if (key.length === 1 && key != '^') {
            // Insert the new char right BEFORE the cursor
            const updated = insertAt(userInput, cursorIndex, key);
            console.log(updated)
            setUserInput(updated);
            return;
        }

        // 2. Left arrow: move 'cursor' left if possible
        else if (key === 'ArrowLeft') {
            if (cursorIndex > 0) {
                // Swap the cursor with the item to its left
                const updated = swapItems(userInput, cursorIndex, cursorIndex - 1);
                setUserInput(updated);
            }
            return;
        }

        // 3. Right arrow: move 'cursor' right if possible
        else if (key === 'ArrowRight') {
            if (cursorIndex < userInput.length - 1) {
                // Swap the cursor with the item to its right
                const updated = swapItems(userInput, cursorIndex, cursorIndex + 1);
                setUserInput(updated);
            }
            return;
        }

        else if (key == 'Backspace') {
            if (cursorIndex > 0) {
                const copy = [...userInput];
                copy.splice(cursorIndex - 1, 1)
                setUserInput(copy);
            }
        }
    };

    function findBase(array) {
        let copy = array.reverse()
        let i = 0
        let count = 1
        let res = ''

        while (count > 0 && i < copy.length) {
            const next = copy[i++]

            if (next == '(') {
                count--
            } else if (next == ')') {
                count++
            } else {
                res = next + res
            }
        }

        return res
    }

    function findChildren(array) {
        let copy = [...array]
        let i = 0
        let count = 1
        let res = []

        while (count > 0 && i < copy.length) {
            const next = copy[i++]

            if (next == ')') {
                count--
            } else if (next == '(') {
                count++
            }

            res.push(next)
        }

        return res
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

    function processExponent(arr) {
        let base = '(';
        let exponent = [];
        let i = 1;
        let parenCount = 1;

        while (parenCount > 0) {
            let next = arr[i]
            if (next == '(') {
                parenCount++;
            }
            if (next == ')') {
                parenCount--;
            }
            base = base + next;
            i++;
        }

        return { type: 'exponent', value: base, children: exponent }
    }

    function processInput(array) {
        const operators = ['+', '-', '*']
        let arr = []
        let i = 0;
        let copy = [...array];
        let pairs = findParenPairs(copy)

        while (i < copy.length) {
            if (/^[a-z0-9]+$/i.test(array[i])) {
                arr.push({
                    type: 'text',
                    value: array[i]
                })
                i++;
            }

            else if (copy[i] == '^') {

                let base = findBase([...copy].slice(0, i)) // returns base as string
                let children_0 = processInput(findChildren([...copy].slice(i + 1))) // returns children of the exponent by recursion

                arr.splice(i - (base.length + 3), base.length)

                arr.push({
                    type: 'exponent',
                    value: base,
                    children: children_0
                })

                i += findChildren([...copy].slice(i + 1)).length;
            }

            else {
                i++;
            }
        }

        console.log(arr);
        return arr;
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
                <Exponent key ={index} node={item} />
            )
        } else {
            // Fraction node
            return (
                <span className="fraction" key={index}>
                    <span className="numerator">{item.numerator || ' '}</span>
                    <span className="fraction-bar" />
                    <span className="denominator">{item.denominator || ' '}</span>
                </span>
            );
        }
    });

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
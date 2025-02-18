import React, { useState, useEffect } from 'react';
import './Log.css';

const LOG_OPEN = '__LOG_OPEN__';
const LOG_CLOSE = '__LOG_CLOSE__';
const CURSOR = 'cursor';

function Log() {
    const [userInput, setUserInput] = useState([CURSOR]);
    const [isFocused, setIsFocused] = useState(false);
    const [processedInput, setProcessedInput] = useState([]);

    useEffect(() => {
        setProcessedInput(processInput(userInput));
        console.log(userInput);
    }, [userInput]);

    // Insert item at given index
    function insertAt(arr, index, item) {
        const copy = [...arr];
        copy.splice(index, 0, item);
        return copy;
    }

    // Swap item at given index
    function swapItems(arr, i, j) {
        const copy = [...arr];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        return copy;
    }

    // Delete item at given index
    function deleteAt(arr, index) {
        const copy = [...arr];
        copy.splice(index, 1);
        return copy;
    }

    // Finds all the parenthesis pairs and returns array
    function findParenPairs(arr) {
        const stack = [];
        const pairs = [];

        for (let i = 0; i < arr.length; i++) {
            const str = arr[i];
            if (str === LOG_OPEN) {
                stack.push(i);
            } else if (str === LOG_CLOSE) {
                const openIndex = stack.pop();
                pairs.push([openIndex, i]);
            }
        }

        return pairs;
    }

    // Handle Log
    function handleLogPress(copy, cursorIndex) {
        // We consider these as "limit" tokens: if we encounter them, stop scanning backward.
        // const limit = ['+', '-', '*', '(', ')', LOG_OPEN, LOG_CLOSE];

        // if the entire array is just [CURSOR], then just insert an empty fraction skeleton.
        // Cursor is located at the numerator
        if (copy.length >= 4) {
            let indexLogClose = copy.length - cursorIndex + 1;
            copy = insertAt(copy, cursorIndex, LOG_OPEN);
            copy = insertAt(copy, cursorIndex + indexLogClose, LOG_CLOSE);
            // console.log(copy.length);
            // console.log(cursorIndex);
            return copy;
        }

        // don't understand...
        // // Otherwise, backtrack until we hit a "limit" or the start,
        // let i = cursorIndex;
        // while (i >= 0 && !limit.includes(copy[i])) {
        //     i--;
        // }
        // copy = insertAt(copy, i + 1, LOG_OPEN);
        // copy = insertAt(copy, cursorIndex + 1, LOG_CLOSE);

        return copy;
    }

    // Handle normal keypress
    function handleCharPress(copy, cursorIndex, key) {
        const updated = insertAt(copy, cursorIndex, key);
        return updated;
    }

    // Handle when left arrow key is pressed
    function handleArrowLeft(copy, cursorIndex) {
        if (cursorIndex <= 0) return copy;
        let targetIndex = cursorIndex - 1;
        const prevChar = copy[targetIndex];

        if ((prevChar === LOG_OPEN || prevChar === LOG_CLOSE)) {
            targetIndex -= 1;
        }

        const updated = insertAt(deleteAt(copy, cursorIndex), targetIndex, CURSOR);
        return updated;
    }

    // Handle when right arrow key is pressed
    function handleArrowRight(copy, cursorIndex) {
        if (cursorIndex >= copy.length - 1) return copy;
        let targetIndex = cursorIndex + 1;
        const nextChar = copy[targetIndex];

        if ((nextChar === LOG_OPEN || nextChar === LOG_CLOSE)) {
            targetIndex += 1;
        }

        const updated = insertAt(deleteAt(copy, cursorIndex), targetIndex, CURSOR);
        return updated;
    }

    // Handle backspace
    function handleBackspace(copy, cursorIndex) {
        if (cursorIndex <= 0) return copy;

        const prevChar = copy[cursorIndex - 1];

        if (prevChar === LOG_CLOSE) {
            if (
                copy.slice(cursorIndex - 5, cursorIndex).join('') ===
                'log__LOG_OPEN____LOG_CLOSE__'
            ) {
                copy.splice(cursorIndex - 3, 3);
            } else {
                copy = swapItems(copy, cursorIndex, cursorIndex - 1);
            }

            return copy;
        }

        if (prevChar === LOG_OPEN) {
            // If the previous character is LOG_OPEN, check if the log function is empty
            const pairs = findParenPairs(copy);
            let logCloseIndex;

            // Find the matching LOG_CLOSE for this LOG_OPEN
            pairs.forEach(([openIdx, closeIdx]) => {
                if (openIdx === cursorIndex - 1) {
                    logCloseIndex = closeIdx;
                }
            });

            copy = deleteAt(copy, logCloseIndex);
            copy.splice(cursorIndex - 2, 2);
            return copy;
        }

        if ('l' === prevChar || 'o' === prevChar || 'g' === prevChar) {
            // If the previous character is LOG_OPEN, check if the log function is empty
            const pairs = findParenPairs(copy);
            let logCloseIndex;
            let logOpenIndex;

            // Find the matching LOG_CLOSE for this LOG_OPEN
            pairs.forEach(([openIdx, closeIdx]) => {
                if (openIdx === cursorIndex + 3 || openIdx === cursorIndex + 2 || openIdx === cursorIndex + 1) {
                    logOpenIndex = openIdx;
                    logCloseIndex = closeIdx;
                }
            });

            if (logOpenIndex !== undefined && logCloseIndex !== undefined) {
                copy = deleteAt(copy, logCloseIndex);
                copy = deleteAt(copy, logOpenIndex);
                copy = deleteAt(copy, cursorIndex - 1);
            } else {
                copy = deleteAt(copy, cursorIndex - 1);
            }

        } else {
            // Otherwise, just delete the previous character
            copy = deleteAt(copy, cursorIndex - 1);
        }
        return copy;
    }

    
    // Main keydown function
    const handleKeyDown = (e) => {
        e.preventDefault();

        const key = e.key;
        let copy = [...userInput];
        const cursorIndex = copy.indexOf(CURSOR);

        if (key.length === 1) {
            copy = handleCharPress(copy, cursorIndex, key);
            
            console.log(cursorIndex);
            if (key === 'g' && cursorIndex >= 2 && copy[cursorIndex - 1] === 'o' && copy[cursorIndex - 2] === 'l') {
                copy = handleLogPress(copy, cursorIndex + 1);
            } else if (key === 'o' && copy[cursorIndex - 1] === 'l' && copy[cursorIndex + 2] === 'g') {
                copy = handleLogPress(copy, cursorIndex + 3);
            } else if (key === 'l' && copy[cursorIndex + 2] === 'o' && copy[cursorIndex + 3] === 'g') {
                copy = handleLogPress(copy, cursorIndex + 4);
            }
            
            // if (key === 'g' && cursorIndex >= 2 && copy[cursorIndex - 1] === 'o' && copy[cursorIndex - 2] === 'l') {
            //     copy = handleLogPress(copy, cursorIndex + 1);
            // }
            
        } else if (key === 'ArrowLeft') {
            copy = handleArrowLeft(copy, cursorIndex);
        } else if (key === 'ArrowRight') {
            copy = handleArrowRight(copy, cursorIndex);
        } else if (key === 'Backspace') {
            copy = handleBackspace(copy, cursorIndex);
        }

        setUserInput(copy);
    };

    // Convert a userInput array into array of objects to handle logarithms
    function processInput(inputArr) {
        const pairs = findParenPairs(inputArr);
        const result = [];
        let i = 0;

        while (i < inputArr.length) {
            const token = inputArr[i];

            if (token === CURSOR) {
                result.push({ type: 'cursor' });
                i++;
            } else if (/^[a-z0-9()+\-*]$/i.test(token)) {
                result.push({ type: 'text', value: token });
                i++;
            } else if (token === LOG_OPEN) {
                let endIndex;
                pairs.forEach(([openIdx, closeIdx]) => {
                    if (openIdx === i) {
                        endIndex = closeIdx;
                    }
                });

                const logContent = inputArr.slice(i + 1, endIndex);

                result.push({
                    type: 'log',
                    value: processInput(logContent),
                });

                i = endIndex + 1;
            } else {
                i++;
            }
        }
        // console.log(result);
        return result;
    }

    // Recursively render the nested structure from processedInput
    function displayText(nodeList) {
        return nodeList.map((node, index) => {
            switch (node.type) {
                case 'text':
                    return <span className="text" key={index}>{node.value}</span>;

                case 'log':
                    return (
                        <span className="log" key={index}>
                            <span className="log-content">{displayText(node.value)}</span>
                        </span>
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

export default Log;

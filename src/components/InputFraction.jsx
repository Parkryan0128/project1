import React, { useState, useEffect } from 'react';
import './InputFraction.css';

const FRACTION_OPEN = '__FRACTION_OPEN__';
const FRACTION_CLOSE = '__FRACTION_CLOSE__';
const CURSOR = 'cursor';

function InputList() {
    const [userInput, setUserInput] = useState([CURSOR]);
    const [isFocused, setIsFocused] = useState(false);
    const [processedInput, setProcessedInput] = useState([]);

    useEffect(() => {
        setProcessedInput(processInput(userInput));
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

    // finds all the parenthesis pairs and returns array
    // e.g. [[0, 2],[3, 4]] => 0 and 2 are pairs, 3 and 4 are pairs
    function findParenPairs(arr) {
        const stack = [];
        const pairs = [];

        for (let i = 0; i < arr.length; i++) {
            const str = arr[i];
            if (str === FRACTION_OPEN) {
                stack.push(i);
            } else if (str === FRACTION_CLOSE) {
                const openIndex = stack.pop();
                pairs.push([openIndex, i]);
            }
        }

        return pairs;
    }

    // Removes fraction based on the case
    function removeFraction(arr, i) {
        const pairs = findParenPairs(arr);

        // If there's a slash immediately before i, that implies this FRACTION_OPEN
        // is for the denominator. We have to remove the entire fraction from that side.
        if (i > 0 && arr[i - 1] === '/') {
            const numerEnd = i - 2;
            let numerStart;
            let denomEnd;

            pairs.forEach(([openIdx, closeIdx]) => {
                if (openIdx === i) {
                    denomEnd = closeIdx;
                }
                if (closeIdx === numerEnd) {
                    numerStart = openIdx;
                }
            });

            let updated = [...arr];
            updated = deleteAt(updated, denomEnd);     // FRACTION_CLOSE of denominator
            updated = deleteAt(updated, i);           // FRACTION_OPEN of denominator
            updated = deleteAt(updated, i - 1);       // slash
            updated = deleteAt(updated, numerEnd);    // FRACTION_CLOSE of numerator
            updated = deleteAt(updated, numerStart);  // FRACTION_OPEN of numerator
            return updated;
        }
        else {
            // Otherwise, i is for the numerator. We need to remove
            // the denominator part as well.
            let numerEnd;
            let denomStart;
            let denomEnd;

            pairs.forEach(([openIdx, closeIdx]) => {
                if (openIdx === i) {
                    numerEnd = closeIdx;
                    denomStart = closeIdx + 2; // skip slash, skip next element
                }
            });

            pairs.forEach(([openIdx, closeIdx]) => {
                if (openIdx === denomStart) {
                    denomEnd = closeIdx;
                }
            });

            let updated = [...arr];
            updated = deleteAt(updated, denomEnd); // FRACTION_CLOSE of denominator
            updated = deleteAt(updated, denomStart); // FRACTION_OPEN of denominator
            updated = deleteAt(updated, numerEnd + 1); // slash
            updated = deleteAt(updated, numerEnd); // FRACTION_CLOSE of numerator
            updated = deleteAt(updated, i); // FRACTION_OPEN of numerator
            return updated;
        }
    }

    // Handle the slash `/` key
    function handleSlashPress(copy, cursorIndex) {
        // We consider these as "limit" tokens: if we encounter them, stop scanning backward.
        // These limits decide the boundary for fraction when slash has been entered.
        const limit = ['+', '-', '*', '(', ')', FRACTION_OPEN, FRACTION_CLOSE];

        // if the entire array is just [CURSOR], then just insert an empty fraction skeleton.
        // Cursor is located at the numerator
        if (copy.length === 1) {
            copy = insertAt(copy, cursorIndex, FRACTION_OPEN);
            copy = insertAt(copy, cursorIndex + 2, FRACTION_CLOSE);
            copy = insertAt(copy, cursorIndex + 3, '/');
            copy = insertAt(copy, cursorIndex + 4, FRACTION_OPEN);
            copy = insertAt(copy, cursorIndex + 5, FRACTION_CLOSE);
            return copy;
        }

        // Otherwise, backtrack until we hit a "limit" or the start,
        // so we know where the numerator should start.
        // In this case, the cursor is at the denominator
        let i = cursorIndex;
        while (i >= 0 && !limit.includes(copy[i])) {
            i--;
        }
        copy = insertAt(copy, i + 1, FRACTION_OPEN);
        copy = insertAt(copy, cursorIndex + 1, FRACTION_CLOSE);
        copy = insertAt(copy, cursorIndex + 2, '/');
        copy = insertAt(copy, cursorIndex + 3, FRACTION_OPEN);
        copy = insertAt(copy, cursorIndex + 5, FRACTION_CLOSE);

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
        let updated;

        // If we are directly after a fraction boundary or slash
        // e.g. [ "/", FRACTION_OPEN, CURSOR ], jump the cursor more than one step
        if (
            cursorIndex > 3 &&
            copy[cursorIndex - 1] === FRACTION_OPEN &&
            copy[cursorIndex - 2] === '/'
        ) {
            updated = insertAt(deleteAt(copy, cursorIndex), cursorIndex - 3, CURSOR);
        } else {
            updated = swapItems(copy, cursorIndex, cursorIndex - 1);
        }
        return updated;
    }

    // Handle when right arrow key is pressed
    function handleArrowRight(copy, cursorIndex) {
        if (cursorIndex >= copy.length - 1) return copy;
        let updated;

        // If we are just before FRACTION_CLOSE and '/', skip fraction boundary
        // e.g. [CURSOR, "/", FRACTION_CLOSE]
        if (
            cursorIndex < copy.length - 4 &&
            copy[cursorIndex + 1] === FRACTION_CLOSE &&
            copy[cursorIndex + 2] === '/'
        ) {
            updated = deleteAt(insertAt(copy, cursorIndex + 4, CURSOR), cursorIndex);
        } else {
            updated = swapItems(copy, cursorIndex, cursorIndex + 1);
        }
        return updated;
    }

    // Handle backspace
    function handleBackspace(copy, cursorIndex) {
        if (cursorIndex <= 0) return copy; // nothing to delete if cursor at start

        // Check the character immediately before the cursor
        const prevChar = copy[cursorIndex - 1];

        // If that character is FRACTION_CLOSE
        if (prevChar === FRACTION_CLOSE) {
            // Check if we have the typical pattern of empty fraction
            // e.g. FRACTION_OPEN + FRACTION_CLOSE + '/' + FRACTION_OPEN + FRACTION_CLOSE
            if (
                copy.length > 5 &&
                copy.slice(cursorIndex - 5, cursorIndex).join('') ===
                '__FRACTION_OPEN____FRACTION_CLOSE__/__FRACTION_OPEN____FRACTION_CLOSE__'
            ) {
                // That means we have a fraction with empty numerator/denominator. Just remove it entirely.
                copy.splice(cursorIndex - 5, 5);
            } else {
                // Otherwise, just move the cursor left (swap)
                copy = swapItems(copy, cursorIndex, cursorIndex - 1);
            }
            return copy;
        }

        // If that character is FRACTION_OPEN, remove the entire fraction
        if (prevChar === FRACTION_OPEN) {
            return removeFraction(copy, cursorIndex - 1);
        }

        // Otherwise, it's a normal character. Just delete
        return deleteAt(copy, cursorIndex - 1);
    }

    // main keydown function
    const handleKeyDown = (e) => {
        e.preventDefault();

        const key = e.key;
        let copy = [...userInput];
        const cursorIndex = copy.indexOf(CURSOR);

        if (key === '/') {
            copy = handleSlashPress(copy, cursorIndex);
        }
        else if (key.length === 1) {
            copy = handleCharPress(copy, cursorIndex, key);
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


    //Convert a userInput array into array of object to handle nested fractions
    function processInput(inputArr) {
        const pairs = findParenPairs(inputArr);
        const result = [];
        let i = 0;

        while (i < inputArr.length) {
            const token = inputArr[i];

            // if cursor, push object with type cursor
            if (token === CURSOR) {
                result.push({ type: 'cursor' });
                i++;
            }
            // regular case, any other characters
            else if (/^[a-z0-9()+\-*]$/i.test(token)) {
                result.push({ type: 'text', value: token });
                i++;
            }
            // If we see a FRACTION_OPEN, parse out numerator & denominator and push fraction obj
            else if (token === FRACTION_OPEN) {
                let endIndex;
                pairs.forEach(([openIdx, closeIdx]) => {
                    if (openIdx === i) {
                        endIndex = closeIdx;
                    }
                });

                // value of numerator
                const numeratorTokens = inputArr.slice(i + 1, endIndex);

                // The next token after endIndex is '/', so the denominator starts 2 indices after endIndex
                const secondChunkStart = endIndex + 2;

                // Find the close pair for the denominator
                let denomCloseIndex;
                pairs.forEach(([openIdx, closeIdx]) => {
                    if (openIdx === secondChunkStart) {
                        denomCloseIndex = closeIdx;
                    }
                });

                // value of the denominator
                const denominatorTokens = inputArr.slice(secondChunkStart + 1, denomCloseIndex);

                // Recursively parse the numerator & denominator
                result.push({
                    type: 'fraction',
                    numerator: processInput(numeratorTokens),
                    denominator: processInput(denominatorTokens),
                });

                // Move i to the end of the denominator
                i = denomCloseIndex + 1;
            }
            // Otherwise, we don't know the token. Just skip
            else {
                i++;
            }
        }

        return result;
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

    // -----------------------------------
    // Render
    // -----------------------------------

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
                outline: 'none', // Removes default focus outline
            }}
        >
            {displayText(processedInput)}
            {/* If you want a visible cursor, you could map the "cursor" token to an actual cursor element. */}
        </div>
    );
}

export default InputList;

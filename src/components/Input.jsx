import React, { useState, useEffect } from 'react'
import './Input.css'
import { processInput } from '../utils/processInput.js';
import { handleIntegral, deleteIntegral } from '../utils/mathUtils/IntegralHelper.js';
import { handleExponents, findMatchingExponentClose,  } from '../utils/mathUtils/ExponentHelper.js';
import { handleFraction, deleteFraction,  } from '../utils/mathUtils/FractionHelper.js';
import { findMatchingSquareRootClose, handleSqrtPressed, isSqrtPressed } from '../utils/mathUtils/SquareRootHelper.js';
import { handleLogarithm  } from '../utils/mathUtils/LogarithmHelper.js';
import { displayText } from '../utils/displayText.jsx';

const CURSOR = 'cursor';
const EMPTY_SPACE = '_EMPTY_SPACE_'

// Exponent constants
const EXPONENT_OPEN = "_EXPONENT_OPEN_";
const EXPONENT_CLOSE = "_EXPONENT_CLOSE_";
// const EMPTY_EXPONENT = '_EMPTY__EXPONENT_';

// Fraction constants

const FRACTION_OPEN = '_FRACTION_OPEN_';
const FRACTION_CLOSE = '_FRACTION_CLOSE_';

// Integral constants

const UPPER_OPEN = '_INT_UPPER_BRACKET_OPEN_';
const UPPER_CLOSE = '_INT_UPPER_BRACKET_CLOSE_';
const LOWER_OPEN = '_INT_LOWER_BRACKET_OPEN_';
const LOWER_CLOSE = '_INT_LOWER_BRACKET_CLOSE_';
const VALUE_OPEN = '_INT_VALUE_BRACKET_OPEN_';
const VALUE_CLOSE = '_INT_VALUE_BRACKET_CLOSE_';

// Log constants

const LOG_OPEN = '_LOG_OPEN_';
const LOG_CLOSE = '_LOG_CLOSE_';

// Square root constants
const SQUARE_ROOT_OPEN = "_SQUARE_ROOT_OPEN_";
const SQUARE_ROOT_CLOSE = "_SQUARE_ROOT_CLOSE_";
// const EMPTY_SQUARE_ROOT = '_EMPTY_SQUARE_ROOT_'

export function insertAt(arr, index, item) {
    /*
    Input:
    - arr: Arry of inputs
    - index: Index of where the item is inserted
    - item: Item to insert

    Output:
    An updated array of inputs, with the item inserted at index
    */

    const copy = [...arr];
    copy.splice(index, 0, item);
    return copy;
}

export function swapItems(arr, i, j) {
    /*
    Input:
    - arr: Array of inputs
    - i: Index of an item to where the item is swapped
    - j: Index of an item of where the item is swapped

    Ouput:
    An updated array of inputs, with the items are swapped
    */


    const copy = [...arr];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
}

// Delete item at given index
export function deleteAt(arr, index) {
    const copy = [...arr];
    copy.splice(index, 1);
    return copy;
}

export function findParenPairs(str, type) {
    const stack = [];
    const pairs = [];

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char.endsWith("OPEN_") && char.startsWith(type)) {
            stack.push(i);
        } else if (char.endsWith("CLOSE_") && char.startsWith(type)) { 
            const openIndex = stack.pop();
            pairs.push([openIndex, i]);
        }
    }

    return pairs;
}





/*----------------------------START----------------------*/

function Input() {
    // useStates
    const [userInput, setUserInput] = useState([CURSOR]);
    const [isFocused, setIsFocused] = useState(false);
    const [processedInput, setProcessedInput] = useState([]);

    useEffect(() => {
        /*
        Everytime userInput changes (aka user types on the input slot),
        we are processing the input as objects and setting it using useState
        */

            setProcessedInput(processInput(userInput));
            console.log(userInput);
            console.log(processInput(userInput));
        }, [userInput]);


    function handleKeyPressed(e) {
        e.preventDefault();

        const key = e.key;
        let copy = [...userInput];
        let cursorIndex = copy.indexOf(CURSOR);

        const int_pairs = findParenPairs(copy, "_INT")
        const frac_pairs = findParenPairs(copy, "_FRACTION")
        const log_pairs = findParenPairs(copy, "_LOG")

        let container = document.getElementById("input0");
        let range = document.createRange();
        let selection = window.getSelection();
        let spans = container.getElementsByTagName("span");

        if ((e.ctrlKey || e.metaKey) && key === 'a') {
            if (spans.length > 0) {
                range.setStartBefore(spans[0]); // Start selection at the first span
                range.setEndAfter(spans[spans.length - 1]); // End selection at the last span
                selection.removeAllRanges(); // Clear any previous selection
                selection.addRange(range); // Apply new selection
            }

        } 

        // if 'key' is non-arrow keys
        else if (/^[a-zA-Z0-9+\-*()=/^]$/.test(e.key)) {
            if (key === '/') {
                copy = handleFraction(copy, cursorIndex);
            } 
            // else if (copy.length === 1) {
            //     copy = insertAt(copy, cursorIndex, key)
            //     setUserInput(copy)
            // }
            else if (key === '^') {
                copy = handleExponents(copy, cursorIndex)
            } 
            else if (key === 't' && isSqrtPressed(copy, cursorIndex)) {
                copy = handleSqrtPressed(copy, cursorIndex)
            }
            else if (key === 't' && copy[cursorIndex-1] === 'n' && copy[cursorIndex-2] === 'i') {
                copy = insertAt(copy, cursorIndex, key)
                copy = handleIntegral(copy, cursorIndex)
            }
            else if (key === 'g' && copy[cursorIndex-1] === 'o' && copy[cursorIndex-2] === 'l') {
                copy = insertAt(copy, cursorIndex, key)
                copy = handleLogarithm(copy, cursorIndex)
            } else if (key === 'o' && copy[cursorIndex-1] === 'l' && copy[cursorIndex+2] === 'g') {
                copy = insertAt(copy, cursorIndex, key)
                copy = swapItems(copy, cursorIndex+1, cursorIndex+2)
                copy = handleLogarithm(copy, cursorIndex+1)
            } else if (key === 'l' && copy[cursorIndex+2] === 'o' && copy[cursorIndex+3] === 'g') {
                copy = insertAt(copy, cursorIndex, key)
                copy = insertAt(copy, cursorIndex+4, CURSOR)
                copy.splice(cursorIndex+1, 1)
                copy = handleLogarithm(copy, cursorIndex+2)
            } else if (key === 'n' && copy[cursorIndex-1] === 'l') {
                copy = insertAt(copy, cursorIndex, key)
                copy = handleLogarithm(copy, cursorIndex)
            } else if (key === 'l' && copy[cursorIndex+1] === 'n') {
                copy = insertAt(copy, cursorIndex, key)
                copy = insertAt(copy, cursorIndex+3, CURSOR)
                copy.splice(cursorIndex, 1)
                copy = handleLogarithm(copy, cursorIndex+1)
            }
            else {
                copy = insertAt(copy, cursorIndex, key)
            }
        }

        else if (key === "Backspace") {
            const prevChar = copy[cursorIndex-1];

            if (cursorIndex <= 0) return copy;

            else if (selection.focusOffset > 1) {
                copy = [CURSOR];
                setUserInput(copy);
                selection.removeAllRanges();
            }

            // deleting fractions
            else if (prevChar === FRACTION_CLOSE) {
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

                setUserInput(copy);
            } else if (prevChar === FRACTION_OPEN) {
                copy = deleteFraction(copy, cursorIndex-1)
                setUserInput(copy)
            }

            // deleting exponents
            else if (prevChar === EXPONENT_OPEN) {
                let closingIndex = findMatchingExponentClose(copy, cursorIndex - 1)

                copy = deleteAt(copy, cursorIndex - 2)
                copy = deleteAt(copy, cursorIndex - 2)
                copy = deleteAt(copy, closingIndex - 2)

                setUserInput(copy);
            } else if (prevChar === EXPONENT_CLOSE) {
                copy = swapItems(copy, cursorIndex, cursorIndex - 1);
                if (copy[cursorIndex - 2] == EMPTY_SPACE) {                                 // changed from empty_exponent
                    copy = deleteAt(copy, cursorIndex - 2)
                }

                setUserInput(copy);
            }

            // deleting square root
            else if (prevChar == SQUARE_ROOT_OPEN) {
                let closingIndex = findMatchingSquareRootClose(copy, cursorIndex - 1)

                copy = deleteAt(copy, cursorIndex - 2)
                copy = deleteAt(copy, cursorIndex - 2)
                copy = deleteAt(copy, closingIndex - 2)
            } else if (prevChar == SQUARE_ROOT_CLOSE) {
                copy = swapItems(copy, cursorIndex, cursorIndex - 1);
                if (copy[cursorIndex - 2] == EMPTY_SPACE) {                     // changed from empty_square_root
                    copy = deleteAt(copy, cursorIndex)
                    copy = deleteAt(copy, cursorIndex - 4)
                    copy = deleteAt(copy, cursorIndex - 4)
                    copy = deleteAt(copy, cursorIndex - 4)
                }
            }

            // deleting integral
            else if (prevChar === UPPER_OPEN) {
                copy = deleteIntegral(copy, int_pairs, cursorIndex, cursorIndex-1, undefined, undefined)
            } else if (prevChar === LOWER_OPEN) {
                copy = deleteIntegral(copy, int_pairs, cursorIndex, undefined, cursorIndex-1, undefined)
                setUserInput(copy);
            } else if (prevChar === VALUE_OPEN &&
                cursorIndex+1 < copy.length-1) {
                    copy = deleteIntegral(copy, int_pairs, cursorIndex, undefined, undefined, cursorIndex-1);
                    setUserInput(copy);
            }

            // when backspace is pressed in value and it has no numbers in it,
            // then we move the cursor to the upperbound
            else if (prevChar === VALUE_OPEN) {
                copy = insertAt(copy, copy.indexOf(UPPER_CLOSE), CURSOR)
                copy.splice(cursorIndex+1, 1)
                setUserInput(copy)
            }


            // deleting logaritm
            else if (prevChar === LOG_CLOSE) {
                if (
                    copy.slice(cursorIndex - 5, cursorIndex).join('') ===
                    'log__LOG_OPEN____LOG_CLOSE__'
                ) {
                    copy.splice(cursorIndex - 3, 3);
                } else {
                    copy = swapItems(copy, cursorIndex, cursorIndex - 1);
                }

                setUserInput(copy);
            } else if (prevChar === LOG_OPEN) {

                let logCloseIndex;
    
                // Find the matching LOG_CLOSE for this LOG_OPEN
                log_pairs.forEach(([openIdx, closeIdx]) => {
                    if (openIdx === cursorIndex - 1) {
                        logCloseIndex = closeIdx;
                    }
                });
    
                copy = deleteAt(copy, logCloseIndex);
                copy.splice(cursorIndex - 2, 2);

                setUserInput(copy);
            } else if ('l' === prevChar || 'o' === prevChar || 'g' === prevChar) {
                let logCloseIndex;
                let logOpenIndex;
    
                // Find a pair of LOG_OPEN and LOG_CLOSE
                log_pairs.forEach(([openIdx, closeIdx]) => {
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
            }

            else {
                copy.splice(cursorIndex-1, 1)
                setUserInput(copy)
            }
            
            
        }

        else if (key === "ArrowRight") {
            if (cursorIndex >= copy.length-1) {
                setUserInput(copy)
            }

            // fraction logic
            else if (
                cursorIndex < copy.length - 4 &&
                copy[cursorIndex + 1] === FRACTION_CLOSE &&
                copy[cursorIndex + 2] === '/'
            ) {
                copy = deleteAt(insertAt(copy, cursorIndex + 4, CURSOR), cursorIndex);
                setUserInput(copy);
            }

            // exponent logic
            else if (copy[cursorIndex + 1] == '^') {
                copy = swapItems(copy, cursorIndex, cursorIndex + 1);
                copy = swapItems(copy, cursorIndex + 1, cursorIndex + 2);
                if (copy[cursorIndex + 3] == EMPTY_SPACE) {                                         // changed from empty_exponent
                    copy = deleteAt(copy, cursorIndex + 3)
                }
            } 
            // else if (copy[cursorIndex + 1] == EXPONENT_CLOSE && 
            //     copy[cursorIndex - 1] == EXPONENT_OPEN) {
            //         copy = insertAt(copy, cursorIndex, EMPTY_SPACE)                         // changed from empty_exponent
            // } 
            else if (copy[cursorIndex+1] === EXPONENT_CLOSE &&
                copy[cursorIndex-1] === EXPONENT_OPEN) {
                    copy = deleteAt(insertAt(copy, cursorIndex+2, CURSOR), cursorIndex)
                    copy = insertAt(copy, cursorIndex, EMPTY_SPACE)
            }

            // square root logic
            else if (copy[cursorIndex + 1] == '√') {
                copy = swapItems(copy, cursorIndex, cursorIndex + 1);
                copy = swapItems(copy, cursorIndex + 1, cursorIndex + 2);
                if (copy[cursorIndex + 3] == EMPTY_SPACE) {                                 // changed from empty_square_root
                    copy = deleteAt(copy, cursorIndex + 3)
                }
            } else if (copy[cursorIndex] == SQUARE_ROOT_CLOSE && 
                copy[cursorIndex - 1] == SQUARE_ROOT_OPEN) {
                    copy = insertAt(copy, cursorIndex, EMPTY_SPACE)                         // changed from empty_square_root 
                }

            // integral logic
            else if (copy[cursorIndex+1] === 'i' && copy[cursorIndex+2] === 'n' && copy[cursorIndex+3] === 't') {
                if (copy[cursorIndex+5] === EMPTY_SPACE) {
                    copy = insertAt(deleteAt(copy, cursorIndex+5), cursorIndex+5, CURSOR)
                    copy = deleteAt(copy, cursorIndex)
                } else {
                    copy = deleteAt(insertAt(copy, cursorIndex+5, CURSOR), cursorIndex)
                }
            } else if (copy[cursorIndex+1] === UPPER_CLOSE) {
                if (copy[cursorIndex-1] === UPPER_OPEN) {
                    copy = insertAt(deleteAt(copy, cursorIndex), cursorIndex, EMPTY_SPACE)
                    copy = insertAt(copy, cursorIndex+3, CURSOR)
                    if (copy[cursorIndex+4] === EMPTY_SPACE) {copy=deleteAt(copy, cursorIndex+4)};
                } else if (copy[cursorIndex+3] === EMPTY_SPACE) {
                    copy = insertAt(deleteAt(copy, cursorIndex+3), cursorIndex+3, CURSOR)
                    copy = deleteAt(copy, cursorIndex)
                } else {
                    copy = deleteAt(insertAt(copy, cursorIndex+3, CURSOR), cursorIndex)
                }
            } else if (copy[cursorIndex+1] === LOWER_CLOSE) {
                if (copy[cursorIndex-1] === LOWER_OPEN) {
                    copy = insertAt(deleteAt(copy, cursorIndex), cursorIndex, EMPTY_SPACE)
                    copy = insertAt(copy, cursorIndex+3, CURSOR);
                    if (copy[cursorIndex+4] === EMPTY_SPACE) {copy = deleteAt(copy, cursorIndex+4)}
                } else if (copy[cursorIndex+3] === EMPTY_SPACE) {
                    copy = insertAt(deleteAt(copy, cursorIndex+3), cursorIndex+3, CURSOR)
                    copy = deleteAt(copy, cursorIndex)
                } else {
                    copy = deleteAt(insertAt(copy, cursorIndex+3, CURSOR), cursorIndex)
                }
            } else if (copy[cursorIndex+1] === VALUE_CLOSE) {
                if (copy[cursorIndex-1] === VALUE_OPEN) {
                    copy = insertAt(deleteAt(copy, cursorIndex), cursorIndex, EMPTY_SPACE)
                    copy = insertAt(copy, cursorIndex+2, CURSOR)
                } else {
                    copy = deleteAt(insertAt(copy, cursorIndex+2, CURSOR), cursorIndex)
                }
            }

            // logarithm logic
            else if ((copy[cursorIndex+1] === LOG_OPEN || copy[cursorIndex+1] === LOG_CLOSE)) {
                copy = insertAt(copy, cursorIndex+2, CURSOR)
                copy.splice(cursorIndex, 1)
                setUserInput(copy)
            }
            
            else {
                copy = swapItems(copy, cursorIndex, cursorIndex+1)
            }
        }

        else if (key === "ArrowLeft") {
            const prevChar = copy[cursorIndex-1]

            if (cursorIndex <= 0) {
                setUserInput(copy)
            } 
            
            // fraction logic
            else if (
                cursorIndex > 3 &&
                copy[cursorIndex - 1] === FRACTION_OPEN &&
                copy[cursorIndex - 2] === '/'
            ) {
                copy = insertAt(deleteAt(copy, cursorIndex), cursorIndex - 3, CURSOR);
                setUserInput(copy);
            }

            // exponent logic
            else if (copy[cursorIndex - 1] == EXPONENT_OPEN) {
                copy = swapItems(copy, cursorIndex, cursorIndex - 1);
                copy = swapItems(copy, cursorIndex - 1, cursorIndex - 2);
                if (copy[cursorIndex + 1] == EXPONENT_CLOSE) {
                    copy = insertAt(copy, cursorIndex + 1, EMPTY_SPACE);
                }
            } 
            else if (copy[cursorIndex-1] == EXPONENT_CLOSE && 
                copy[cursorIndex - 2] == EMPTY_SPACE) {                                     //changed from empty_exponent                                              // changed from empty_exponent
                    copy = insertAt(deleteAt(deleteAt(copy, cursorIndex), cursorIndex-2), cursorIndex-2, CURSOR)
            } 

            // square root logic
            else if (prevChar == SQUARE_ROOT_OPEN) {
                copy = swapItems(copy, cursorIndex, cursorIndex - 1);
                copy = swapItems(copy, cursorIndex - 1, cursorIndex - 2);
                if (copy[cursorIndex + 1] == SQUARE_ROOT_CLOSE) {
                    copy = insertAt(copy, cursorIndex + 1, EMPTY_SPACE);                    // changed from empty_square_root
                }
            } else if (copy[cursorIndex] == SQUARE_ROOT_CLOSE && 
                copy[cursorIndex - 2] == EMPTY_SPACE) {                             // changed from empty_square_root
                    arr = deleteAt(arr, cursorIndex - 2)
                }

            // integral logic
            else if (copy[cursorIndex-1] === UPPER_OPEN) {
                if (copy[cursorIndex+1] === UPPER_CLOSE) {
                    copy = insertAt(deleteAt(copy, cursorIndex), cursorIndex, EMPTY_SPACE)
                    copy = insertAt(copy, cursorIndex-4, CURSOR)
                } else {
                    copy = insertAt(deleteAt(copy, cursorIndex), cursorIndex-4, CURSOR)
                }
            } else if (copy[cursorIndex-1] === LOWER_OPEN) {
                if (copy[cursorIndex+1] === LOWER_CLOSE) {
                    copy = insertAt(deleteAt(copy, cursorIndex), cursorIndex, EMPTY_SPACE)
                    copy = insertAt(copy, cursorIndex-3, CURSOR)
                    if (copy[cursorIndex-2] === EMPTY_SPACE) {copy = deleteAt(copy, cursorIndex-2)}
                } else if (copy[cursorIndex-3] === EMPTY_SPACE) {
                    copy = insertAt(deleteAt(copy, cursorIndex-3), cursorIndex-3, CURSOR)
                    copy = deleteAt(copy, cursorIndex)
                }
            } else if (copy[cursorIndex-1] === VALUE_OPEN) {
                if (copy[cursorIndex+1] === VALUE_CLOSE) {
                    copy = insertAt(deleteAt(copy, cursorIndex), cursorIndex, EMPTY_SPACE)
                    copy = insertAt(copy, cursorIndex-3, CURSOR)
                    if (copy[cursorIndex-2] === EMPTY_SPACE) {copy = deleteAt(copy, cursorIndex-2)}
                } else if (copy[cursorIndex-3] === EMPTY_SPACE) {
                    copy = insertAt(deleteAt(copy, cursorIndex-3), cursorIndex-3, CURSOR)
                    copy = deleteAt(copy, cursorIndex)
                }
            } else if (copy[cursorIndex-1] === VALUE_CLOSE) {
                if (copy[cursorIndex-2] === EMPTY_SPACE) {
                    copy = insertAt(deleteAt(copy, cursorIndex-2), cursorIndex-2, CURSOR)
                    copy = deleteAt(copy, cursorIndex)
                } else {
                    copy = swapItems(copy, cursorIndex-1, cursorIndex)
                }
            }

            else {
                copy = swapItems(copy, cursorIndex-1, cursorIndex)
            }
        }
        

        else if (key === "ArrowUp") {
            let start = null;
            let end = null;
            for (let i=0; i< frac_pairs.length; i++) {
                if (cursorIndex > frac_pairs[i][0] && cursorIndex < frac_pairs[i][1]) {
                    start = frac_pairs[i][0];
                    end = frac_pairs[i][1];
                    break;
                }
            }

            if (copy[cursorIndex + 1] == '^') {
                copy = swapItems(copy, cursorIndex, cursorIndex + 1);
                copy = swapItems(copy, cursorIndex + 1, cursorIndex + 2);
                if (copy[cursorIndex + 3] == EMPTY_SPACE) {                                         // changed from empty_exponent
                    copy = deleteAt(copy, cursorIndex + 3)
                }
            } else if (copy[cursorIndex] == EXPONENT_CLOSE && 
                copy[cursorIndex - 1] == EXPONENT_OPEN) {
                    copy = insertAt(copy, cursorIndex, EMPTY_SPACE)                                     //changed empty_exponent
                }
    
            else if (start != null && start > 1 && copy[start-1] == '/') {
                copy = insertAt(deleteAt(copy, cursorIndex),start-2, CURSOR);
            }

            else if (copy[cursorIndex-1] === LOWER_OPEN && copy[cursorIndex+1] === LOWER_CLOSE) {
                copy = insertAt(deleteAt(copy, cursorIndex), cursorIndex, EMPTY_SPACE)
                copy = insertAt(copy, cursorIndex-3, CURSOR)
                if (copy[cursorIndex-2] === EMPTY_SPACE) {copy = deleteAt(copy, cursorIndex-2)}
            }

            else if (cursorIndex > int_pairs[1][0] && cursorIndex < int_pairs[1][1]) {
                const lower_diff = cursorIndex - int_pairs[1][0]

                if (lower_diff > int_pairs[0][1]-int_pairs[0][0]) {
                    copy = insertAt(copy, int_pairs[0][1], CURSOR)
                    copy.splice(cursorIndex+1,1)
                } else {
                    copy = insertAt(copy, int_pairs[0][0]+lower_diff, CURSOR)
                    copy.splice(cursorIndex+1, 1)
                }
            } 

            else if (copy[cursorIndex-1] === VALUE_OPEN && copy[cursorIndex+1] === VALUE_CLOSE) {
                copy = insertAt(deleteAt(copy, cursorIndex), cursorIndex, EMPTY_SPACE)
                copy = insertAt(copy, int_pairs[0][1], CURSOR)
                if (copy[int_pairs[0][1]-1] === EMPTY_SPACE) {copy = deleteAt(copy, int_pairs[0][1]-1)}
            }
            
            else if (cursorIndex > int_pairs[2][0] && cursorIndex < int_pairs[2][1]) {
                copy = insertAt(copy, int_pairs[0][1], CURSOR)
                copy.splice(cursorIndex+1,1)
            }
        }

        else if (key === "ArrowDown") {

            let start = null;
            let end = null;
            for (let i=0; i< frac_pairs.length; i++) {
                if (cursorIndex > frac_pairs[i][0] && cursorIndex < frac_pairs[i][1]) {
                    start = frac_pairs[i][0];
                    end = frac_pairs[i][1];
                    break;
                }
            }

            if (copy[cursorIndex - 1] == EXPONENT_OPEN) {
                copy = swapItems(copy, cursorIndex, cursorIndex - 1);
                copy = swapItems(copy, cursorIndex - 1, cursorIndex - 2);
                if (copy[cursorIndex + 1] == EXPONENT_CLOSE) {
                    copy = insertAt(copy, cursorIndex + 1, EMPTY_SPACE);                                    // changed from empty_exponent
                }
            } 
            else if (copy[cursorIndex] == EXPONENT_CLOSE && 
                copy[cursorIndex - 2] == EMPTY_SPACE) {                                         // changed from empty_exponent
                    copy = deleteAt(copy, cursorIndex - 2)
                }
    
            else if (start != null && copy[end+1] == '/') {
                copy = deleteAt(insertAt(copy,end+3, CURSOR), cursorIndex)
            }

            else if (copy[cursorIndex-1] === UPPER_OPEN && copy[cursorIndex+1] === UPPER_CLOSE) {
                copy = insertAt(deleteAt(copy, cursorIndex), cursorIndex, EMPTY_SPACE)
                copy = insertAt(copy, cursorIndex+3, CURSOR)
                if (copy[cursorIndex+4] === EMPTY_SPACE) {copy = deleteAt(copy, cursorIndex+4)}
            }

            else if (cursorIndex > int_pairs[0][0] && cursorIndex < int_pairs[0][1]) {
                const upper_diff = cursorIndex - int_pairs[0][0];
                
                if (upper_diff > int_pairs[1][1]-int_pairs[1][0]) {
                    copy = insertAt(copy, int_pairs[1][1], CURSOR)
                    copy.splice(cursorIndex, 1)
                } else {
                    copy = insertAt(copy, int_pairs[1][0]+upper_diff, CURSOR)
                    copy.splice(cursorIndex,1)
                }
            } 
            
            else if (copy[cursorIndex-1] === VALUE_OPEN && copy[cursorIndex+1] === VALUE_CLOSE) {
                copy = insertAt(deleteAt(copy, cursorIndex), cursorIndex, EMPTY_SPACE)
                copy = insertAt(copy, int_pairs[1][1], CURSOR)
                if (copy[int_pairs[1][1]-1] === EMPTY_SPACE) {copy = deleteAt(copy, int_pairs[1][1]-1)}
            }
            else if (cursorIndex > int_pairs[2][0] && cursorIndex < int_pairs[2][1]) {
                copy = insertAt(copy, int_pairs[1][1], CURSOR)
                copy.splice(cursorIndex+1,1)
            }

        }
        setUserInput(copy);
    };


    return (
        <div
            tabIndex={0}
            id='input0'
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyPressed}
            // style={{
            //     border: isFocused ? '2px solid blue' : '1px solid gray',
            //     padding: '8px',
            //     minHeight: '40px',
            //     outline: 'none', // Removes default focus outline
            // }}
        >
            {displayText(processedInput)}
            {/* If you want a visible cursor, you could map the "cursor" token to an actual cursor element. */}
        </div>
    )


}

export default Input;

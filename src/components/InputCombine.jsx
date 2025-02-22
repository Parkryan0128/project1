import React, { useState, useEffect } from 'react'
import './Input.css'

const CURSOR = 'cursor';

// Exponent constants
const EXPONENT_OPEN = "_EXPONENT_OPEN_";
const EXPONENT_CLOSE = "_EXPONENT_CLOSE_";
const EMPTY_EXPONENT = '_EMPTY__EXPONENT_';

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
const EMPTY_SQUARE_ROOT = '_EMPTY_SQUARE_ROOT_'


/*----------------------------Functions----------------------*/

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

    /*----------------------------Helper Functions----------------------*/

    function insertAt(arr, index, item) {
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

    function swapItems(arr, i, j) {
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
    function deleteAt(arr, index) {
        const copy = [...arr];
        copy.splice(index, 1);
        return copy;
    }

    // finds all the parenthesis pairs and returns array
    // e.g. [[0, 2],[3, 4]] => 0 and 2 are pairs, 3 and 4 are pairs
    function findParenPairs(str) {
        const stack = [];
        const pairs = [];

        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char.endsWith("OPEN_")) {
                stack.push(i);
            } else if (char.endsWith("CLOSE_")) { 
                const openIndex = stack.pop();
                pairs.push([openIndex, i]);
            }
        }

        return pairs;
    }

    /*----------------------Handling Exponents--------------------*/

    function handleExponents(arr, cursorIndex) {

        /*
        Handles when '^' is pressed

        Input: 
        - arr: Array of inputs
        - cursorIndex: Index of the cursor

        Output:
        An updated array of inputs with the exponent components added to it
        */


        // if userInput only contains cursor, no action
        // if (arr.length <= 1) return arr;

        // if '^' was pressed right in front of another ^, move cursor to right
        if (arr[cursorIndex+1] === '^') {
            arr = swapItems(arr, cursorIndex, cursorIndex+1);
            arr = swapItems(arr, cursorIndex+1, cursorIndex+2);

            if (arr[cursorIndex+3] === EMPTY_EXPONENT) {
                arr = deleteAt(arr, cursorIndex+3);
            }

            return arr;
        }

        // otherwise, insert '^', EXPONENT_OPEN and EXPONENT_CLOSE
        arr = insertAt(arr, cursorIndex, '^')
        arr = insertAt(arr, cursorIndex + 1, EXPONENT_OPEN)
        arr = insertAt(arr, cursorIndex + 3, EXPONENT_CLOSE)

        return arr;
    }

    function findBase(array) {
        let temp = [...array]
        let i = temp.length - 1
        let res = []
        const limit = ['+', '-', '*', '(', ')', 
            // FRACTION_OPEN, FRACTION_CLOSE, 
            UPPER_OPEN, UPPER_CLOSE, LOWER_OPEN, LOWER_CLOSE, VALUE_OPEN, VALUE_CLOSE, 
            EXPONENT_OPEN, EXPONENT_CLOSE, 
            LOG_OPEN, LOG_CLOSE];

        if (temp[i] == ')') {
            while (i >= 0 && temp[i] != '(') {
                const next = temp[i]
                // res = next + res
                res.splice(0, 0, next)
                i--
            }
            // res = '(' + res;
            res.splice(0, 0, "(");
        } else {
            // the second condition was temp[i] != ')'
            while (i >= 0 && !limit.includes(temp[i]) && temp[i] != EXPONENT_CLOSE) {
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
            if (curr === EXPONENT_OPEN) {
                count++;
            }
            else if (curr === EXPONENT_CLOSE) {
                count--;
            }
            res.push(curr)
            i++
        }
        return res;
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

    /*----------------------Handling Fraction--------------------*/

    function handleFraction(arr, cursorIndex) {

        /*
        Handles when '/' is pressed

        Input: 
        - arr: Array of inputs
        - cursorIndex: index of the cursor

        Output:
        An updated array of inputs with the fraction components added to it
        */

        const limit = ['+', '-', '*', '(', ')', 
            FRACTION_OPEN, FRACTION_CLOSE, 
            UPPER_OPEN, UPPER_CLOSE, LOWER_OPEN, LOWER_CLOSE, VALUE_OPEN, VALUE_CLOSE, 
            EXPONENT_OPEN, EXPONENT_CLOSE, 
            LOG_OPEN, LOG_CLOSE];

        // if userInput only contains cursor, no action
        if (arr.length === 1) {
            arr = insertAt(arr, cursorIndex, FRACTION_OPEN);
            arr = insertAt(arr, cursorIndex + 2, FRACTION_CLOSE);
            arr = insertAt(arr, cursorIndex + 3, '/');
            arr = insertAt(arr, cursorIndex + 4, FRACTION_OPEN);
            arr = insertAt(arr, cursorIndex + 5, FRACTION_CLOSE);
            return arr;
        }

        // may need refactoring
        let i = cursorIndex;
        while (i >= 0 && !limit.includes(arr[i])) {
            i--;
        }
        arr = insertAt(arr, i + 1, FRACTION_OPEN);
        arr = insertAt(arr, cursorIndex + 1, FRACTION_CLOSE);
        arr = insertAt(arr, cursorIndex + 2, '/');
        arr = insertAt(arr, cursorIndex + 3, FRACTION_OPEN);
        arr = insertAt(arr, cursorIndex + 5, FRACTION_CLOSE);

        return arr;
    }

    function processFraction(inputArr, pairs, i) {
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
        return [{
            type: 'fraction',
            numerator: processInput(numeratorTokens),
            denominator: processInput(denominatorTokens),
        }, denomCloseIndex + 1];

        // // Move i to the end of the denominator
        // i = denomCloseIndex + 1;
    }

    // Removes fraction based on the case
    function deleteFraction(arr, i) {
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

    /*----------------------Handling Integral--------------------*/

    function handleIntegral(arr, cursorIndex) {
        arr = insertAt(arr, cursorIndex+1, UPPER_OPEN);
        arr = insertAt(arr, cursorIndex+2, CURSOR);
        arr = insertAt(arr, cursorIndex+3, UPPER_CLOSE);
        arr = insertAt(arr, cursorIndex+4, LOWER_OPEN);
        arr = insertAt(arr, cursorIndex+5, LOWER_CLOSE);
        arr = insertAt(arr, cursorIndex+6, VALUE_OPEN);
        arr = insertAt(arr, cursorIndex+7, VALUE_CLOSE);
        arr.splice(cursorIndex+8, 1);

        return arr;
    }

    function processIntegral(inputArr, pairs, i) {
        let end;
        pairs.forEach((item) => {
            if (item[0] == i + 3) {
                end = item[1]
            }
        })

        const upper = inputArr.slice(i+4, end)
        i = end + 1

        pairs.forEach((item) => {
            if (item[0] == i) {
                end = item[1]
            }
        })

        const lower = inputArr.slice(i+1, end)
        i = end + 1

        pairs.forEach((item) => {
            if (item[0] == i) {
                end = item[1]
            }
        })

        const value = inputArr.slice(i+1, end)
    

        return [{
            type: 'integral',
            value: processInput(value),
            upperBound: processInput(upper),
            lowerBound: processInput(lower)
        }, end+1];
    }

    function deleteIntegral(inputArr, pairs, cursorIndex, upper_start, lower_start, value_start) {
        let upperStart = upper_start;
        let upperEnd;
        let lowerStart = lower_start;
        let lowerEnd;
        let valueStart = value_start;
        let valueEnd;

        if (upperStart !== undefined) {
            pairs.forEach((item) => {
                if (item[0] === upperStart) {
                    upperEnd = item[1]
                    lowerStart = item[1] + 1
                }
            })

            pairs.forEach((item) => {
                if (item[0] === lowerStart) {
                    lowerEnd = item[1];
                    valueStart = item[1] + 1;
                }
            })

            pairs.forEach((item) => {
                if (item[0] === valueStart) {
                    valueEnd = item[1];
                }
            })

            // inputArr.splice(cursorIndex-4, 3)
            inputArr.splice(upperStart-3, 3)
            inputArr = deleteAt(inputArr, upperStart-3)
            inputArr = deleteAt(inputArr, upperEnd-4)
            inputArr = deleteAt(inputArr, lowerStart-5)
            inputArr = deleteAt(inputArr, lowerEnd-6)
            inputArr = deleteAt(inputArr, valueStart-7)
            inputArr = deleteAt(inputArr, valueEnd-8)

            return inputArr;

        } else if (lowerStart !== undefined) {
            pairs.forEach((item) => {
                if (item[0] === lowerStart) {
                    lowerEnd = item[1]
                    valueStart = item[1] + 1
                    upperEnd = item[0] - 1
                }
            })

            pairs.forEach((item) => {
                if (item[0] === valueStart) {
                    valueEnd = item[1];
                }
            })

            pairs.forEach((item) => {
                if (item[1] === upperEnd) {
                    upperStart = item[0];
                }
            })

            // inputArr.splice(cursorIndex-6, 3)
            inputArr.splice(upperStart-3, 3)
            inputArr = deleteAt(inputArr, upperStart-3)
            inputArr = deleteAt(inputArr, upperEnd-4)
            inputArr = deleteAt(inputArr, lowerStart-5)
            inputArr = deleteAt(inputArr, lowerEnd-6)
            inputArr = deleteAt(inputArr, valueStart-7)
            inputArr = deleteAt(inputArr, valueEnd-8)

            return inputArr;
        } else if (valueStart !== null && cursorIndex+1) {
            pairs.forEach((item) => {
                if (item[0] === valueStart) {
                    valueEnd = item[1]
                    lowerEnd = item[0] - 1
                }
            })

            pairs.forEach((item) => {
                if (item[1] === lowerEnd) {
                    lowerStart = item[0];
                    upperEnd = item[0] - 1;
                }
            })

            pairs.forEach((item) => {
                if (item[1] === upperEnd) {
                    upperStart = item[0];
                }
            })

            // inputArr.splice(cursorIndex-8, 3)
            inputArr.splice(upperStart-3, 3)
            inputArr = deleteAt(inputArr, upperStart-3)
            inputArr = deleteAt(inputArr, upperEnd-4)
            inputArr = deleteAt(inputArr, lowerStart-5)
            inputArr = deleteAt(inputArr, lowerEnd-6)
            inputArr = deleteAt(inputArr, valueStart-7)
            inputArr = deleteAt(inputArr, valueEnd-8)

            return inputArr;
        }
    }

    /*----------------------Handling Logarithm--------------------*/
    
    function handleLogarithm(arr, cursorIndex) {
        arr = insertAt(arr, cursorIndex+1, LOG_OPEN);
        arr = insertAt(arr, cursorIndex+2, CURSOR)
        arr = insertAt(arr, cursorIndex+3, LOG_CLOSE);
        arr.splice(cursorIndex+4, 1);

        return arr;
    }

    function processLogarithm(inputArr, pairs, i) {
        let endIndex;
        pairs.forEach(([openIdx, closeIdx]) => {
            if (openIdx === i) {
                endIndex = closeIdx;
            }
        });

        const logContent = inputArr.slice(i + 1, endIndex);

        return [{
            type: 'log',
            value: processInput(logContent),
        }, endIndex+1];
    }

    /*----------------------Handling Square Root--------------------*/

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

    function findRadicand(arr) {
        let res = []
        let closeIndex = findMatchingSquareRootClose(arr, 0)

        for (let i = 1; i < closeIndex; i++) {
            res.push(arr[i])
        }

        if (res.length == 1 && res[0] == 'cursor') {
            res.push(EMPTY_SQUARE_ROOT)
        }

        return res;
    }


    function handleKeyPressed(e) {
        e.preventDefault();

        const key = e.key;
        let copy = [...userInput];
        let cursorIndex = copy.indexOf(CURSOR);
        const pairs = findParenPairs(copy);

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
                if (copy[cursorIndex - 2] == EMPTY_EXPONENT) {
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
                if (copy[cursorIndex - 2] == EMPTY_SQUARE_ROOT) {
                    copy = deleteAt(copy, cursorIndex)
                    copy = deleteAt(copy, cursorIndex - 4)
                    copy = deleteAt(copy, cursorIndex - 4)
                    copy = deleteAt(copy, cursorIndex - 4)
                }
            }

            // deleting integral
            else if (prevChar === UPPER_OPEN) {
                copy = deleteIntegral(copy, pairs, cursorIndex, cursorIndex-1, undefined, undefined)
            } else if (prevChar === LOWER_OPEN) {
                copy = deleteIntegral(copy, pairs, cursorIndex, undefined, cursorIndex-1, undefined)
                setUserInput(copy);
            } else if (prevChar === VALUE_OPEN &&
                cursorIndex+1 < copy.length-1) {
                    copy = deleteIntegral(copy, pairs, cursorIndex, undefined, undefined, cursorIndex-1);
                    setUserInput(copy);
            }

            // else if (prevChar === UPPER_OPEN) {

            //     let upperStart = cursorIndex - 1;
            //     let upperEnd;
            //     let lowerStart;
            //     let lowerEnd;
            //     let valueStart;
            //     let valueEnd;


            //     pairs.forEach((item) => {
            //         if (item[0] === upperStart) {
            //             upperEnd = item[1]
            //             lowerStart = item[1] + 1
            //         }
            //     })

            //     pairs.forEach((item) => {
            //         if (item[0] === lowerStart) {
            //             lowerEnd = item[1];
            //             valueStart = item[1] + 1;
            //         }
            //     })

            //     pairs.forEach((item) => {
            //         if (item[0] === valueStart) {
            //             valueEnd = item[1];
            //         }
            //     })

            //     copy.splice(cursorIndex-4, 3)
            //     copy = deleteAt(copy, upperStart-3)
            //     copy = deleteAt(copy, upperEnd-4)
            //     copy = deleteAt(copy, lowerStart-5)
            //     copy = deleteAt(copy, lowerEnd-6)
            //     copy = deleteAt(copy, valueStart-7)
            //     copy = deleteAt(copy, valueEnd-8)

            //     setUserInput(copy)
            // } 
            // else if (prevChar === LOWER_OPEN) {
            //     let upperStart;
            //     let upperEnd;
            //     let lowerStart = cursorIndex - 1;
            //     let lowerEnd;
            //     let valueStart;
            //     let valueEnd;

            //     pairs.forEach((item) => {
            //         if (item[0] === lowerStart) {
            //             lowerEnd = item[1]
            //             valueStart = item[1] + 1
            //             upperEnd = item[0] - 1
            //         }
            //     })

            //     pairs.forEach((item) => {
            //         if (item[0] === valueStart) {
            //             valueEnd = item[1];
            //         }
            //     })

            //     pairs.forEach((item) => {
            //         if (item[1] === upperEnd) {
            //             upperStart = item[0];
            //         }
            //     })

            //     copy.splice(cursorIndex-6, 3)
            //     copy = deleteAt(copy, upperStart-3)
            //     copy = deleteAt(copy, upperEnd-4)
            //     copy = deleteAt(copy, lowerStart-5)
            //     copy = deleteAt(copy, lowerEnd-6)
            //     copy = deleteAt(copy, valueStart-7)
            //     copy = deleteAt(copy, valueEnd-8)

            //     setUserInput(copy)

            // }
            // else if (prevChar === VALUE_OPEN &&
            //     cursorIndex+1 < copy.length-1) {
            //     let upperStart;
            //     let upperEnd;
            //     let lowerStart;
            //     let lowerEnd;
            //     let valueStart = cursorIndex - 1;
            //     let valueEnd;

            //     pairs.forEach((item) => {
            //         if (item[0] === valueStart) {
            //             valueEnd = item[1]
            //             lowerEnd = item[0] - 1
            //         }
            //     })

            //     pairs.forEach((item) => {
            //         if (item[1] === lowerEnd) {
            //             lowerStart = item[0];
            //             upperEnd = item[0] - 1;
            //         }
            //     })

            //     pairs.forEach((item) => {
            //         if (item[1] === upperEnd) {
            //             upperStart = item[0];
            //         }
            //     })

            //     copy.splice(cursorIndex-8, 3)
            //     copy = deleteAt(copy, upperStart-3)
            //     copy = deleteAt(copy, upperEnd-4)
            //     copy = deleteAt(copy, lowerStart-5)
            //     copy = deleteAt(copy, lowerEnd-6)
            //     copy = deleteAt(copy, valueStart-7)
            //     copy = deleteAt(copy, valueEnd-8)

            //     setUserInput(copy)
            // }
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
                pairs.forEach(([openIdx, closeIdx]) => {
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
                if (copy[cursorIndex + 3] == EMPTY_EXPONENT) {
                    copy = deleteAt(copy, cursorIndex + 3)
                }
            } else if (copy[cursorIndex] == EXPONENT_CLOSE && 
                copy[cursorIndex - 1] == EXPONENT_OPEN) {
                    copy = insertAt(copy, cursorIndex, EMPTY_EXPONENT)
                }

            // square root logic
            else if (copy[cursorIndex + 1] == '√') {
                copy = swapItems(copy, cursorIndex, cursorIndex + 1);
                copy = swapItems(copy, cursorIndex + 1, cursorIndex + 2);
                if (copy[cursorIndex + 3] == EMPTY_SQUARE_ROOT) {
                    copy = deleteAt(copy, cursorIndex + 3)
                }
            } else if (copy[cursorIndex] == SQUARE_ROOT_CLOSE && 
                copy[cursorIndex - 1] == SQUARE_ROOT_OPEN) {
                    copy = insertAt(copy, cursorIndex, EMPTY_SQUARE_ROOT) 
                }

            // integral logic
            else if (copy[cursorIndex+1] === 'i' && copy[cursorIndex+2] === 'n' && copy[cursorIndex+3] === 't') {
                copy = insertAt(copy, cursorIndex+5, CURSOR)
                copy.splice(cursorIndex, 1)
                setUserInput(copy)
            } else if (copy[cursorIndex+1] ===UPPER_CLOSE) {
                copy = insertAt(copy, cursorIndex+3, CURSOR)
                copy.splice(cursorIndex, 1)
                setUserInput(copy)
            } else if (copy[cursorIndex+1] === LOWER_CLOSE) {
                copy = insertAt(copy, cursorIndex+3, CURSOR)
                copy.splice(cursorIndex,1)
                setUserInput(copy)
            } 

            // logarithm logic
            else if ((copy[cursorIndex+1] === LOG_OPEN || copy[cursorIndex+1] === LOG_CLOSE)) {
                copy = insertAt(copy, cursorIndex+2, CURSOR)
                copy.splice(cursorIndex, 1)
                setUserInput(copy)
            }
            
            else {
                copy = swapItems(copy, cursorIndex, cursorIndex+1)
                setUserInput(copy)
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
                    copy = insertAt(copy, cursorIndex + 1, EMPTY_EXPONENT);
                }
            } 
            else if (copy[cursorIndex] == EXPONENT_CLOSE && 
                copy[cursorIndex - 2] == EMPTY_EXPONENT) {
                    copy = deleteAt(copy, cursorIndex - 2)
                }

            // square root logic
            else if (prevChar == SQUARE_ROOT_OPEN) {
                copy = swapItems(copy, cursorIndex, cursorIndex - 1);
                copy = swapItems(copy, cursorIndex - 1, cursorIndex - 2);
                if (copy[cursorIndex + 1] == SQUARE_ROOT_CLOSE) {
                    copy = insertAt(copy, cursorIndex + 1, EMPTY_SQUARE_ROOT);
                }
            } else if (copy[cursorIndex] == SQUARE_ROOT_CLOSE && 
                copy[cursorIndex - 2] == EMPTY_SQUARE_ROOT) {
                    arr = deleteAt(arr, cursorIndex - 2)
                }

            // integral logic
            else if (copy[cursorIndex-1] === UPPER_OPEN) {
                copy = insertAt(copy, cursorIndex-4, CURSOR)
                cursorIndex = copy.lastIndexOf(CURSOR)
                copy.splice(cursorIndex, 1)
                setUserInput(copy)
            } else if (copy[cursorIndex-1] === LOWER_OPEN) {
                copy = insertAt(copy, cursorIndex-2, CURSOR)
                cursorIndex = copy.lastIndexOf(CURSOR)
                copy.splice(cursorIndex, 1)
                setUserInput(copy)
            } else if (copy[cursorIndex-1] === VALUE_OPEN) {
                copy = insertAt(copy, cursorIndex-2, CURSOR)
                cursorIndex = copy.lastIndexOf(CURSOR)
                copy.splice(cursorIndex, 1)
                setUserInput(copy)
            }

            else {
                copy = swapItems(copy, cursorIndex-1, cursorIndex)
                setUserInput(copy);
            }
        }
        

        else if (key === "ArrowUp") {
            let start = null;
            let end = null;
            for (let i=0; i< pairs.length; i++) {
                if (cursorIndex > pairs[i][0] && cursorIndex < pairs[i][1]) {
                    start = pairs[i][0];
                    end = pairs[i][1];
                    break;
                }
            }

            if (copy[cursorIndex + 1] == '^') {
                copy = swapItems(copy, cursorIndex, cursorIndex + 1);
                copy = swapItems(copy, cursorIndex + 1, cursorIndex + 2);
                if (copy[cursorIndex + 3] == EMPTY_EXPONENT) {
                    copy = deleteAt(copy, cursorIndex + 3)
                }
            } else if (copy[cursorIndex] == EXPONENT_CLOSE && 
                copy[cursorIndex - 1] == EXPONENT_OPEN) {
                    copy = insertAt(copy, cursorIndex, EMPTY_EXPONENT)
                }
    
            else if (start != null && start > 1 && copy[start-1] == '/') {
                copy = insertAt(deleteAt(copy, cursorIndex),start-2, CURSOR);
            }

            else if (cursorIndex > pairs[1][0] && cursorIndex < pairs[1][1]) {
                const lower_diff = cursorIndex - pairs[1][0]

                if (lower_diff > pairs[0][1]-pairs[0][0]) {
                    copy = insertAt(copy, pairs[0][1], CURSOR)
                    copy.splice(cursorIndex+1,1)
                } else {
                    copy = insertAt(copy, pairs[0][0]+lower_diff, CURSOR)
                    copy.splice(cursorIndex+1, 1)
                }
            } else if (cursorIndex > pairs[2][0] && cursorIndex < pairs[2][1]) {
                copy = insertAt(copy, pairs[0][1], CURSOR)
                copy.splice(cursorIndex+1,1)
            }
        }

        else if (key === "ArrowDown") {

            let start = null;
            let end = null;
            for (let i=0; i< pairs.length; i++) {
                if (cursorIndex > pairs[i][0] && cursorIndex < pairs[i][1]) {
                    start = pairs[i][0];
                    end = pairs[i][1];
                    break;
                }
            }

            if (copy[cursorIndex - 1] == EXPONENT_OPEN) {
                copy = swapItems(copy, cursorIndex, cursorIndex - 1);
                copy = swapItems(copy, cursorIndex - 1, cursorIndex - 2);
                if (copy[cursorIndex + 1] == EXPONENT_CLOSE) {
                    copy = insertAt(copy, cursorIndex + 1, EMPTY_EXPONENT);
                }
            } 
            else if (copy[cursorIndex] == EXPONENT_CLOSE && 
                copy[cursorIndex - 2] == EMPTY_EXPONENT) {
                    copy = deleteAt(copy, cursorIndex - 2)
                }
    
            // else if (start != null && copy[end+1] == '/') {
            //     copy = deleteAt(insertAt(copy,end+3, CURSOR), cursorIndex)
            // }

            else if (cursorIndex > pairs[0][0] && cursorIndex < pairs[0][1]) {
                const upper_diff = cursorIndex - pairs[0][0];
                
                if (upper_diff > pairs[1][1]-pairs[1][0]) {
                    copy = insertAt(copy, pairs[1][1], CURSOR)
                    copy.splice(cursorIndex, 1)
                } else {
                    copy = insertAt(copy, pairs[1][0]+upper_diff, CURSOR)
                    copy.splice(cursorIndex,1)
                }
            } else if (cursorIndex > pairs[2][0] && cursorIndex < pairs[2][1]) {
                copy = insertAt(copy, pairs[1][1], CURSOR)
                copy.splice(cursorIndex+1,1)
            }

        }
        console.log(pairs)
        setUserInput(copy);
    };

    function processInput(inputArr) {
        const result = [];
        let i = 0;
        const pairs = findParenPairs(inputArr);


        while (i < inputArr.length) {
            
            const token = inputArr[i];

            if (token === CURSOR) {
                result.push({
                    type: 'cursor',
                });
                i++;
            }

            else if (token === FRACTION_OPEN) {
                let [temp, i_temp] = processFraction(inputArr, pairs, i);
                result.push(temp);
                i = i_temp;
            }

            else if (token === EMPTY_EXPONENT) {
                result.push({type: 'empty_exponent'})
                i++
            } else if (token === '^') {
                let base = processInput(findBase([...inputArr].slice(0, i)))
                let children_0 = processInput(findChildren([...inputArr].slice(i + 1)))


                result.splice(result.length - base.length, base.length)

                result.push({
                    type: 'exponent',
                    value: base,
                    children: children_0
                })

                i += findChildren([...inputArr].slice(i + 1)).length;
                // console.log(base)
                // console.log(children_0)
            }

            else if (token == EMPTY_SQUARE_ROOT) {
                result.push({type : 'empty_square_root'})
                i++
            } else if (token === '√') {
                let closeIndex = findMatchingSquareRootClose(inputArr, i + 1)
                let jumpIndex = closeIndex - i;

                let radicand = processInput(findRadicand([...inputArr].slice(i + 1)))

                result.push({
                    type: 'square-root',
                    value: radicand
                })

                i = i + jumpIndex + 1;
            }

            else if (/^[a-zA-Z0-9+\-*()=]+$/i.test(token)) {

                if (token === 'i' && inputArr[i+1] === 'n' && inputArr[i+2] === 't') {
                    let [temp, i_temp] = processIntegral(inputArr, pairs, i);
                    result.push(temp);
                    i = i_temp;
                }

                else if (token === LOG_OPEN) {
                    let [temp, i_temp] = processLogarithm(inputArr, pairs, i);
                    result.push(temp);
                    i = i_temp;
                }

                else {
                    result.push({
                        type: 'text',
                        value: token
                    });
                    i++;
                }
            }

            else {
                i++;
            }
        }

        return result;
    }

    
    function displayText(nodeList) {
        return nodeList.map((node, index) => {
            switch (node.type) {
                case 'text':
                    return (<span key={index}>{node.value}</span>);
                
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
                    )

                case 'empty_square_root':
                    return (
                        <span key={index} className="empty-square-root"/>
                    );

                case 'fraction':
                    return (<span className="fraction" key={index}>
                        <span className="numerator">{displayText(node.numerator)}</span>
                        <span className="fraction-bar" />
                        <span className="denominator">{displayText(node.denominator)}</span>
                    </span>
                    );
                
                case 'integral':
                    return (<span className='integral' key={index}>
                        <span className='upper-bound'>{displayText(node.upperBound)}</span>
                        <span className='integral-sign'>
                        <big>∫</big>
                        </span>
                        <span className='integral-value'>{displayText(node.value)}</span>
                        <span>dx</span>
                        <span className='lower-bound'>{displayText(node.lowerBound)}</span>
                    </span>);

                case 'log':
                    return (<span className="log" key={index}>
                        <span className="log-content">{displayText(node.value)}</span>
                    </span>
                    );

                case 'cursor':
                    return (<span key={index} className="blink-cursor">
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
            id='input0'
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyPressed}
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
    )


}

export default Input;

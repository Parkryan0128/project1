import {insertAt, swapItems, deleteAt} from "../InputHelper.js";
import { processInput } from "../processInput.js"

// Constants
const CURSOR = 'cursor';
const EMPTY_SPACE = '_EMPTY_SPACE_'
const UPPER_OPEN = '_INT_UPPER_BRACKET_OPEN_';
const UPPER_CLOSE = '_INT_UPPER_BRACKET_CLOSE_';
const LOWER_OPEN = '_INT_LOWER_BRACKET_OPEN_';
const LOWER_CLOSE = '_INT_LOWER_BRACKET_CLOSE_';
const VALUE_OPEN = '_INT_VALUE_BRACKET_OPEN_';
const VALUE_CLOSE = '_INT_VALUE_BRACKET_CLOSE_';

    export function handleIntegral(arr, cursorIndex) {
        arr = insertAt(arr, cursorIndex+1, UPPER_OPEN);
        arr = insertAt(arr, cursorIndex+2, CURSOR);
        arr = insertAt(arr, cursorIndex+3, UPPER_CLOSE);
        arr = insertAt(arr, cursorIndex+4, LOWER_OPEN);
        arr = insertAt(arr, cursorIndex+5, EMPTY_SPACE);
        arr = insertAt(arr, cursorIndex+6, LOWER_CLOSE);
        arr = insertAt(arr, cursorIndex+7, VALUE_OPEN);
        arr = insertAt(arr, cursorIndex+8, EMPTY_SPACE);
        arr = insertAt(arr, cursorIndex+9, VALUE_CLOSE);
        arr.splice(cursorIndex+10, 1);

        return arr;
    }

    export function processIntegral(inputArr, pairs, i) {
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

    export function deleteIntegral(inputArr, pairs, cursorIndex, upper_start, lower_start, value_start) {
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
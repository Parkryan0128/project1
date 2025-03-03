import {insertAt, swapItems, deleteAt} from "../InputHelper.js";

// Constants
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


export function handleExponents(arr, cursorIndex) {

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


    export function findBase(array) {
        let temp = [...array]
        let i = temp.length - 1
        let res = []
        const limit = ['+', '-', '*', '(', ')', 
            FRACTION_OPEN, FRACTION_CLOSE, 
            UPPER_OPEN, UPPER_CLOSE, LOWER_OPEN, LOWER_CLOSE, VALUE_OPEN, VALUE_CLOSE, 
            EXPONENT_OPEN, EXPONENT_CLOSE, 
            LOG_OPEN, LOG_CLOSE,
            SQUARE_ROOT_OPEN, SQUARE_ROOT_CLOSE];

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

    export function findChildren(array) {
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

    export function findMatchingExponentClose(array, openIndex) {
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
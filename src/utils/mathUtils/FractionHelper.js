import {insertAt, swapItems, deleteAt} from "../InputHelper.js";
import { processInput } from "../processInput.js";

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


    export function handleFraction(arr, cursorIndex) {

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
            LOG_OPEN, LOG_CLOSE,
            SQUARE_ROOT_OPEN, SQUARE_ROOT_CLOSE];

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

    export function processFraction(inputArr, pairs, i) {
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
    export function deleteFraction(arr, i) {
        const pairs = findParenPairs(arr, "_FRACTION");

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
import {insertAt, swapItems, deleteAt} from "../InputHelper.js";
import { processInput } from "../processInput.js";

// Constants
const CURSOR = 'cursor';
const LOG_OPEN = '_LOG_OPEN_';
const LOG_CLOSE = '_LOG_CLOSE_';

    export function handleLogarithm(arr, cursorIndex) {
        arr = insertAt(arr, cursorIndex+1, LOG_OPEN);
        arr = insertAt(arr, cursorIndex+2, CURSOR)
        arr = insertAt(arr, cursorIndex+3, LOG_CLOSE);
        arr.splice(cursorIndex+4, 1);

        return arr;
    }

    export function processLogarithm(inputArr, pairs, i) {
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
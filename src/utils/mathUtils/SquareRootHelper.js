import {insertAt, swapItems, deleteAt} from "../InputHelper.js";

// Constant
const SQUARE_ROOT_OPEN = "_SQUARE_ROOT_OPEN_";
const SQUARE_ROOT_CLOSE = "_SQUARE_ROOT_CLOSE_";
const EMPTY_SQUARE_ROOT = '_EMPTY_SQUARE_ROOT_'

    export function findMatchingSquareRootClose(array, openIndex) {
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

    export function isSqrtPressed(arr, cursorIndex) {
        let i = cursorIndex;
        return arr[i - 3] == 's' && arr[i - 2] == 'q' && arr[i - 1] == 'r'
    }

    export function handleSqrtPressed(arr, cursorIndex) {
        arr = deleteAt(arr, cursorIndex - 3);
        arr = deleteAt(arr, cursorIndex - 3);
        arr = deleteAt(arr, cursorIndex - 3);
        arr = insertAt(arr, cursorIndex - 3, '√');
        arr = insertAt(arr, cursorIndex - 2, SQUARE_ROOT_OPEN);
        arr = insertAt(arr, cursorIndex, SQUARE_ROOT_CLOSE);
        return arr;
    }

    export function findRadicand(arr) {
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
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
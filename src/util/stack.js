
// This class is the implementation of Stack data structure

export class Stack {

    // Array is used to implement stack
    constructor() {
        this.items = [];
    }

    // append new item to the items
    push(item) {
        this.items.push(item);
    }

    // return top most element in the stack
    // and removes it from the stack
    // Underflow if stack is empty
    pop() {
        if (this.items.length == 0) {
            return 'Underflow'
        }
        return this.items.pop();
    }

    // returns the top most element from the stack
    peek() {       
        return this.items[this.items.length - 1];
    }

    // returns true if stack is empty
    isEmpty() {
        return this.items.length == 0;
    }

    //returns how many items are in the stack
    size() {
        return this.items.length;
    }
}

// test
// let stack = new Stack();
// stack.push(5)
// console.log(stack.peek())

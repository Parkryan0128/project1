
// This class is the implementation of Queue data structure

export class Queue {

    // Array is used to implement queue
    constructor() {
        this.items = [];
        this.frontIndex = 0;
        this.backIndex = 0;
    }

    // the item is added to the back of the queue
    // and the index is incremented by 1
    enqueue(item) {
        this.items[this.backIndex] = item
        this.backIndex++
    }

    // the item is removed from the front of the queue
    dequeue(item) {
        const first_item = this.items[this.frontIndex]
        delete this.items[this.frontIndex]
        this.frontIndex++
        return item
    }

    // returns the first item in the queue
    peek() {
        return this.items[this.frontIndex]
    }

    // returns true if the queue is empty
    isEmpty() {
        return this.items.length == 0
    }

    // returns the length of the queue
    size() {
        return this.items.length
    }

    // returns the list
    getItems() {
        return this.items
    }

}


// test
// let queue = new Queue()

// queue.enqueue(4)
// console.log(queue.size())
// queue.dequeue()
// queue.enqueue(1)
// queue.enqueue(2)
// console.log(queue.isEmpty())
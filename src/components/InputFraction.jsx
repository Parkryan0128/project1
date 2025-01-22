import React, { useState, useEffect } from 'react'
import './InputFraction.css'

function InputList() {
    const [userInput, setUserInput] = useState(['cursor']);
    const [isFocused, setIsFocused] = useState(false);
    const [processedInput, setProcessedInput] = useState([]);


    useEffect(() => {
        setProcessedInput(processInput(userInput));
    }, [userInput])

    function findParenPairs(str) {
        const stack = [];
        const pairs = [];

        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char === '(') {
                // Push the index of the '(' onto the stack
                stack.push(i);
            } else if (char === ')') {
                // Pop the last '(' from the stack (it matches this ')')
                const openIndex = stack.pop();
                // Record the pair of indexes
                pairs.push([openIndex, i]);
            }
            // Ignore any other characters
        }

        return pairs;
    }

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        // If you want to finalize fraction editing on blur, you could do so here.
    };

    function insertAt(arr, index, item) {
        const copy = [...arr];
        copy.splice(index, 0, item);
        return copy;
    }

    // Helper: Swap items at two indexes (immutable)
    function swapItems(arr, i, j) {
        const copy = [...arr];
        [copy[i], copy[j]] = [copy[j], copy[i]];
        return copy;
    }



    const handleKeyDown = (e) => {
        e.preventDefault(); // Prevent default browser behavior
        const key = e.key;
        const cursorIndex = userInput.indexOf('cursor');

        if (key == '/') {

            const copy = [...userInput];
            const limit = ['+', '-', '(', ')']

            if (copy.length == 1) {
                copy.splice(cursorIndex, 0, '(')
                copy.splice(cursorIndex + 2, 0, ')')
                copy.splice(cursorIndex + 3, 0, '/')
                copy.splice(cursorIndex + 4, 0, '(')
                copy.splice(cursorIndex + 5, 0, ')')
                console.log(copy)
                setUserInput(copy)
            } else {
                let i = cursorIndex;
                while (i >= 0 && !limit.includes(copy[i])) {
                    i--;
                }
                copy.splice(i + 1, 0, '(');
                copy.splice(cursorIndex + 1, 0, ')')
                copy.splice(cursorIndex + 2, 0, '/')
                copy.splice(cursorIndex + 3, 0, '(')
                copy.splice(cursorIndex + 5, 0, ')')
                console.log(copy)
                setUserInput(copy)
            }


        } else if (key.length === 1) {
            // Insert the new char right BEFORE the cursor
            const updated = insertAt(userInput, cursorIndex, key);
            setUserInput(updated);
            return;
        }

        // 2. Left arrow: move 'cursor' left if possible
        else if (key === 'ArrowLeft') {
            if (cursorIndex > 0) {
                // Swap the cursor with the item to its left
                const updated = swapItems(userInput, cursorIndex, cursorIndex - 1);
                setUserInput(updated);
            }
            return;
        }

        // 3. Right arrow: move 'cursor' right if possible
        else if (key === 'ArrowRight') {
            if (cursorIndex < userInput.length - 1) {
                // Swap the cursor with the item to its right
                const updated = swapItems(userInput, cursorIndex, cursorIndex + 1);
                setUserInput(updated);
            }
            return;
        }

        else if (key == 'Backspace') {
            if (cursorIndex > 0) {
                const copy = [...userInput];
                copy.splice(cursorIndex - 1, 1)
                setUserInput(copy);
            }
        }
    };

    const processInput = (userInput) => {
        const operators = ['+', '-', '*']
        let arr = []
        let i = 0;
        let copy = [...userInput];
        let pairs = findParenPairs(copy)

        while (i < copy.length) {
            if (/^[a-z0-9]+$/i.test(userInput[i])) {
                arr.push({
                    type: 'text',
                    value: userInput[i]
                })
                i++;
            } else if (copy[i] == '(') {
                let end;
                pairs.forEach((item) => {
                    if (item[0] == i) {
                        end = item[1];
                    }
                })

                let temp = [];
                for (let j = i + 1; j <= end - 1; j++) {
                    temp.push(copy[j])
                }

                i = end + 2
                let denom = [];

                pairs.forEach((item) => {
                    if (item[0] == i) {
                        end = item[1];
                    }
                })

                for (let j = i + 1; j <= end - 1; j++) {
                    denom.push(copy[j])
                }

                arr.push({
                    type: 'fraction',
                    numerator: processInput(temp),
                    denominator: processInput(denom),
                })

                i = end + 1;
            } else {
                i++;
            }
        }
        return arr;
    }

    const displayText = (list) => {
        return list.map((item, index) => {
            if (item.type === 'text') {
                return (
                    <span key={index}>{item.value}</span>
                );
            } else {
                // Fraction node
                return (
                    <span className="fraction" key={index}>
                        <span className="numerator">{displayText(item.numerator)}</span>
                        <span className="fraction-bar" />
                        <span className="denominator">{displayText(item.denominator)}</span>
                    </span>
                );
            }
        })
    }

    // Render the userInput
    // const display = processedInput.map((item, index) => {
    //     if (item.type === 'text') {
    //         return (
    //             <span key={index}>{item.value}</span>
    //         );
    //     } else {
    //         // Fraction node
    //         return (
    //             <span className="fraction" key={index}>
    //                 <span className="numerator">{displayText(item.numerator)}</span>
    //                 <span className="fraction-bar" />
    //                 <span className="denominator">{displayText(item.denominator)}</span>
    //             </span>
    //         );
    //     }
    // });


    return (
        <div
            tabIndex={0}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{
                border: isFocused ? '2px solid blue' : '1px solid gray',
                padding: '8px',
                minHeight: '40px',
                outline: 'none', // Removes default focus outline
            }}
        >
            {displayText(processedInput)}
            {/* {isFocused && <span className="cursor">|</span>} */}
        </div>
    );
}

export default InputList;
import React, { useState, useEffect } from 'react'
import './InputFraction.css'

function InputList() {
    const [userInput, setUserInput] = useState(['cursor']);
    const [isFocused, setIsFocused] = useState(false);
    const [processedInput, setProcessedInput] = useState([]);


    useEffect(() => {
        processInput()
    }, [userInput])

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

        if (key.length === 1) {
            // Insert the new char right BEFORE the cursor
            const updated = insertAt(userInput, cursorIndex, key);
            setUserInput(updated);
            return;
        }

        // 2. Left arrow: move 'cursor' left if possible
        if (key === 'ArrowLeft') {
            if (cursorIndex > 0) {
                // Swap the cursor with the item to its left
                const updated = swapItems(userInput, cursorIndex, cursorIndex - 1);
                setUserInput(updated);
            }
            return;
        }

        // 3. Right arrow: move 'cursor' right if possible
        if (key === 'ArrowRight') {
            if (cursorIndex < userInput.length - 1) {
                // Swap the cursor with the item to its right
                const updated = swapItems(userInput, cursorIndex, cursorIndex + 1);
                setUserInput(updated);
            }
            return;
        }

        // if (key == 'Backspace')


        // // 1. If user presses '/', create a fraction node
        // if (key === '/') {
        //     // Extract a possible numerator from the tail end of userInput
        //     if (userInput.length > 0) {
        //         let num = '';
        //         let i = current;

        //         // We stop if we see an operator or a fraction
        //         while (i >= 0 && !operators.includes(userInput[i].value) && userInput[i].type !== 'fraction') {
        //             // Prepend text, because we're going backwards
        //             num = userInput[i].value + num;
        //             i--;
        //         }

        //         // 'arr' is everything *before* that extracted text
        //         const arr = userInput.slice(0, i + 1);

        //         // Add a fraction node with the numerator
        //         const fractionNode = {
        //             type: 'fraction',
        //             numerator: num,
        //             denominator: '',
        //         };

        //         setUserInput([...arr, fractionNode]);
        //         setIsEditingDenominator(true);
        //     } else {
        //         // If there's nothing typed yet, we can either:
        //         // - Treat '/' as just text, or
        //         // - Create an empty fraction. Let's create an empty fraction:
        //         setUserInput((prev) => [
        //             ...prev,
        //             { type: 'fraction', numerator: '', denominator: '' },
        //         ]);
        //         setIsEditingDenominator(false);
        //     }

        //     return;
        // }

        // // 2. If user presses a single printable character
        // if (key.length === 1) {
        //     if (isEditingDenominator) {
        //         // If we're editing the fraction’s denominator, add the character there
        //         setUserInput((prev) => {
        //             if (prev.length === 0) {
        //                 // Edge case: shouldn't happen if fraction was created, but just in case
        //                 return [{ type: 'text', value: key }];
        //             }
        //             const last = prev[prev.length - 1];
        //             if (last && last.type === 'fraction') {
        //                 const updated = {
        //                     ...last,
        //                     denominator: last.denominator + key,
        //                 };
        //                 return [...prev.slice(0, -1), updated];
        //             } else {
        //                 // Fallback if something went wrong, just add text
        //                 return [...prev, { type: 'text', value: key }];
        //             }
        //         });
        //     } else if (
        //         !isEditingDenominator &&
        //         userInput[userInput.length - 1] &&
        //         userInput[userInput.length - 1].type === 'fraction'
        //     ) {
        //         // We are typing into the numerator
        //         setUserInput((prev) => {
        //             const lastFraction = prev[prev.length - 1];
        //             const updated = {
        //                 type: 'fraction',                        // <-- must keep type
        //                 numerator: lastFraction.numerator + key, // <-- append key to numerator
        //                 denominator: lastFraction.denominator,   // <-- keep existing denominator
        //             };
        //             return [...prev.slice(0, -1), updated];
        //         });
        //     } else {
        //         // Otherwise, just append a text node
        //         setCurrent(current++);
        //         setUserInput((prev) => [...prev, { type: 'text', value: key }]);
        //     }
        //     return;
        // }

        // // 3. If user presses Backspace
        // if (key === 'Backspace') {
        //     setUserInput((prev) => {
        //         if (prev.length === 0) return prev; // nothing to delete

        //         const last = prev[prev.length - 1];

        //         // If we are editing denominator
        //         if (isEditingDenominator && last.type === 'fraction') {
        //             const { denominator } = last;
        //             if (denominator.length > 0) {
        //                 // Remove last char from denominator
        //                 const updated = {
        //                     ...last,
        //                     denominator: denominator.slice(0, -1),
        //                 };
        //                 return [...prev.slice(0, -1), updated];
        //             } else {
        //                 setIsEditingDenominator(false)
        //                 return [...prev.slice(0, -1), { ...last, denominator: '' }]
        //             }
        //         } else if (!isEditingDenominator && last.type == 'fraction') {
        //             const { numerator } = last;
        //             if (numerator.length > 0) {
        //                 // Remove last char from denominator
        //                 const updated = {
        //                     ...last,
        //                     numerator: numerator.slice(0, -1),
        //                 };
        //                 return [...prev.slice(0, -1), updated];
        //             } else {
        //                 // If denominator is empty, remove fraction node entirely
        //                 return prev.slice(0, -1);
        //             }

        //         } else {
        //             // If the last item is a fraction but we’re not editing denominator,
        //             // or it's text, just remove that entire item
        //             return prev.slice(0, -1);
        //         }
        //     });
        //     return;
        // }

        // // 4. If user presses Enter (optional handling)
        // if (key === 'Enter') {
        //     // For now, do nothing special
        //     return;
        // }

        // if (key === 'ArrowLeft') {
        //     // Move current left if possible
        //     if (current > 0) {
        //         setCurrent(current - 1);
        //     }
        //     return;
        // }

        // if (key === 'ArrowRight') {
        //     // Move current right if possible
        //     if (current == userInput.length -1 && userInput[current].type == 'fraction') {

        //     }
        //     if (current < userInput.length - 1) {
        //         setCurrent(current + 1);
        //     }
        //     return;
        // }

        // if (key === 'ArrowUp') {
        //     // If the current item is fraction, go to numerator
        //     const item = userInput[current];
        //     if (item && item.type === 'fraction') {
        //         setIsEditingDenominator(false);
        //     }
        //     return;
        // }

        // if (key === 'ArrowDown') {
        //     // If the current item is fraction, go to denominator
        //     const item = userInput[current];
        //     if (item && item.type === 'fraction') {
        //         setIsEditingDenominator(true);
        //     }
        //     return;
        // }
    };

    const processInput = () => {
        const operators = ['+', '-', '*', '/']
        let arr = []
        for (let i = 0; i < userInput.length; i++) {
            if (/^[a-z0-9]+$/i.test(userInput[i])) {
                arr.push({
                    type: 'text',
                    value: userInput[i]
                })
            }
            else if (userInput[i] == '/') {
                if (arr[arr.length - 1].type == "text") {
                    let i = arr.length - 1;
                    let num = '';
                    while (i >= 0 && !operators.includes(arr[i].value) && arr[i].type !== 'fraction') {
                        num = arr[i].value + num;
                        i--;
                    }
                    arr = [...arr.slice(0, i + 1)]
                    arr.push({
                        type: 'fraction',
                        numerator: num,
                        denominator: ''
                    })

                } else {
                    arr.push({
                        type: 'fraction',
                        numerator: '',
                        denominator: ''
                    })
                }
            }
        }
        setProcessedInput(arr);
    }

    // Render the userInput
    const display = processedInput.map((item, index) => {
        if (item.type === 'text') {
            return (
                <span key={index}>{item.value}</span>
            );
        } else {
            // Fraction node
            return (
                <span className="fraction" key={index}>
                    <span className="numerator">{item.numerator || ' '}</span>
                    <span className="fraction-bar" />
                    <span className="denominator">{item.denominator || ' '}</span>
                </span>
            );
        }
    });

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
            {display}
            {/* {isFocused && <span className="cursor">|</span>} */}
        </div>
    );
}

export default InputList;
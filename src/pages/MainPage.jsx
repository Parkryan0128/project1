import React, { useState, useEffect, useRef } from 'react';
import InputList from '../components/InputList';
import GraphCanvas from '../components/GraphCanvas';
import './MainPage.css';

const MainPage = () => {
    const [hidden, setHidden] = useState(false);
    const [graphWidth, setGraphWidth] = useState(window.innerWidth * 0.70);
    const [graphHeight, setGraphHeight] = useState(window.innerHeight);
    const [inputValue, setInputValues] = useState([]);
    const [equation, setEquation] = useState([]);
    const [inputWidth, setInputWidth] = useState(window.innerWidth * 0.30);

    const sidebarRef = useRef(null);
    const resizerRef = useRef(null);
    const startX = useRef(0);
    const startWidth = useRef(0);
    const isResizing = useRef(false);


    // Log the equation array whenever it changes
    useEffect(() => {
        console.log("Type of equation", typeof(equation));
        console.log("Current equations:", equation);
        console.log("Lenght of equation array: ", equation.length);
    }, [equation]);

    // check if the input is a valid mathematical equation
    const isValidEquation = (input) => {
        try {
            input = input.replace(/\s+/g, ''); // remove extra spaces
            // // allow y = expression or x = expression
            // if (input.startsWith("y=") || input.startsWith("x=")) {
            //     return true;
            // }

            // ensure input includes a valid variable (x or y)
            if (!input.includes('x') && !input.includes('y')) {
                return false;
            }

            // // ensure valid mathematical symbols
            // const validCharsRegex = /^[0-9xy+\-*/^()\s=]+$/;
            // if (!validCharsRegex.test(input)) {
            //     return false;
            // }

            // validate equation structure by evaluating the right-hand side
            const equationParts = input.split('=');
            if (equationParts.length > 2) {
                return false; // invalid if multiple `=`
            }

            if (equationParts.length === 2) {
                const lhs = equationParts[0].trim(); // Left-hand side
                const rhs = equationParts[1].trim(); // Right-hand side

                // Check if LHS and RHS contain the same variable in an invalid way
                if (lhs === 'x' && rhs.includes('x')) {
                    return false; // invalid: x = x + 2
                }
                if (lhs === 'y' && rhs.includes('y')) {
                    return false; // invalid: y = y + 2
                }

                if (rhs === '') {
                    return false; // invalid if right-hand side is empty
                }

                new Function('x', `return ${rhs}`); // validate right-hand expression
            } else {
                // if no '=', assume implicit y = expression
                new Function('x', `return ${input}`);
            }

            return true; // if all checks pass, it's valid
        } catch (err) {
            return false; // invalid expression
        }
    };

    // useEffect(() => {
    //     const newEquations = [...equation];

    //     inputValue.forEach((row, index) => {
    //         const input = row.value.replace(/\s+/g, ''); // Remove extra spaces

    //         // Check if the input is just y (invalid)
    //         if (input === 'y') {
    //             console.log("Invalid input:", input);
    //             delete newEquations[index]; // remove this equation
    //             return; // skip further processing
    //         }

    //         if (isValidEquation(input)) {
    //             let formattedEquation = input;
    //             if (!input.includes('=')) {
    //                 formattedEquation = `y=${input}`; // Format as y = expression if no '='
    //             }

    //             // overwrite the equation at the corresponding index
    //             newEquations[index] = formattedEquation;
    //         } else {
    //             console.log(index);
    //             console.log("Removed: ", newEquations[index]);
    //             // if the input is invalid, remove the equation at this index
    //             delete newEquations[index];
    //         }
    //     });

    //     // Remove undefined entries (from deleted rows)
    //     const filteredEquations = newEquations.filter(eq => eq !== null);

    //     setEquation(filteredEquations); // Update the equation array
    // }, [inputValue]);
    // Handle input changes and update equation state immediately

    useEffect(() => {
        if (hidden) {
            setInputWidth(0);
            setGraphWidth(window.innerWidth);
        } else {
            setInputWidth(window.innerWidth * 0.30);
            setGraphWidth(window.innerWidth * 0.70);
        }
    }, [hidden]);

    // handles input changes and updates the equation state dynamically
    const handleInputChange = (rows) => {
        setInputValues(rows); // update inputValue state

        // update equation array immediately
        const newEquations = rows.map((row) => {
            const input = row.value.replace(/\s+/g, ''); // remove extra spaces

            // check if the input is just y (invalid)
            if (input === 'y') {
                console.log("Invalid input:", input);
                return null; // skip this equation
            }

            if (isValidEquation(input)) {
                let formattedEquation = input;
                if (!input.includes('=')) {
                    formattedEquation = `y=${input}`; // Format as y = expression if no =
                }
                return formattedEquation;
            } else {
                return null; // skip invalid equations
            }
        });

        // filter out null entries (invalid or skipped equations)
        const filteredEquations = newEquations.filter(eq => eq !== null);
        setEquation(filteredEquations);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        isResizing.current = true;
        startX.current = e.clientX;

        let sbWidth = window.getComputedStyle(sidebarRef.current).width;
        startWidth.current = parseInt(sbWidth, 10);

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }

    const handleMouseUp = () => {
        isResizing.current = false;
        // removew event mousemove && mouseup
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // Mouse Move Handler to Resize
    const handleMouseMove = (e) => {
        if (!isResizing) return;
        let dx = e.clientX - startX.current;
        let newWidth = startWidth.current + dx; // complete width

        const minSidebarWidth = window.innerWidth * 0.15;
        const maxSidebarWidth = window.innerWidth * 0.50;
        
        if (newWidth < minSidebarWidth) newWidth = minSidebarWidth;
        if (newWidth > maxSidebarWidth) newWidth = maxSidebarWidth;

        const newGraphWidth = window.innerWidth - newWidth;
        if (newGraphWidth >= window.innerWidth * 0.40) {
            setInputWidth(newWidth);
            setGraphWidth(newGraphWidth);
        }
    };


    return (
        <div className='graph-layout'>
            {!hidden && (
                <div className='input-section' ref={sidebarRef} style={{ width: inputWidth }}>
                    <InputList hidden={hidden} setHidden={setHidden} setGraphWidth={setGraphWidth} onInputChange={handleInputChange} inputValue={inputValue}/>
                    <div className="resizer" ref={resizerRef} onMouseDown={handleMouseDown} />
                </div>
            )}

            <div className='graph-section' style={{ width: graphWidth }}>
                {/* Render all equations */}
                {/* {equation.map((eq, index) => (
                    <GraphCanvas
                        key={index}
                        graphWidth={graphWidth}
                        graphEquation={eq}
                    />
                ))} */}
                <GraphCanvas equation={equation} graphWidth={graphWidth} graphHeight={graphHeight} graphEquation={equation}/>
                {/* <GraphCanvas graphWidth={graphWidth} graphEquation={equation} /> */}
                {hidden && (
                    <button className='input-list__show-btn' onClick={() => setHidden(false)}>
                        {'>>'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default MainPage;
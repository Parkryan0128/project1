import React, { useState, useEffect, useRef } from 'react';
import InputList from '../components/InputList';
import GraphCanvas from '../components/GraphCanvas';
import './MainPage.css';

const MainPage = () => {
    const [hidden, setHidden] = useState(false);
    const [graphWidth, setGraphWidth] = useState(window.innerWidth * 0.70);
    const [inputValue, setInputValues] = useState([]);
    const [equation, setEquation] = useState('');
    // const [equation, setEquation] = useState([]);
    const [inputWidth, setInputWidth] = useState(window.innerWidth * 0.30);

    const sidebarRef = useRef(null);
    const resizerRef = useRef(null);
    const startX = useRef(0);
    const startWidth = useRef(0);
    const isResizing = useRef(false);

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
                const rhs = equationParts[1].trim();
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
        setInputValues(rows);

        if (rows.length > 0) {
            const lastInput = rows[rows.length - 1].value.replace(/\s+/g, '');
            console.log("Processing input:", lastInput);

            if (isValidEquation(lastInput)) {
                console.log("Valid equation detected");

                if (lastInput.includes('=')) {
                    // Keep valid "y=" or "x=" format
                    setEquation(lastInput);
                } else if (lastInput.includes('x')) {
                    // If it contains x but no '=', assume y = expression
                    setEquation(`y=${lastInput}`);
                } else {
                    setEquation('');
                }
            } else {
                console.log("Invalid equation");
                setEquation('');
            }
        } else {
            setEquation('');
        }
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
                <GraphCanvas graphWidth={graphWidth} graphEquation={equation || 'y + 2 = x + 3'}/>
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
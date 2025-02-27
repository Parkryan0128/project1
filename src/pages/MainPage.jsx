import React, { useState, useEffect, useRef } from 'react';
import InputList from '../components/InputList';
import GraphCanvas from '../components/GraphCanvas';
import DoubleRightIcon from '../assets/double_right.png';
import './MainPage.css';

const MainPage = () => {
    const [hidden, setHidden] = useState(false);
    const [graphWidth, setGraphWidth] = useState(window.innerWidth * 0.70);
    const [graphHeight, setGraphHeight] = useState(window.innerHeight);

    const [equation, setEquation] = useState([{ expression: "", color: "black"}]);

    const [inputWidth, setInputWidth] = useState(window.innerWidth * 0.30);

    const sidebarRef = useRef(null);
    const resizerRef = useRef(null);
    const startX = useRef(0);
    const startWidth = useRef(0);
    const isResizing = useRef(false);

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
    // const handleInputChange = (rows) => {
    //     setInputValues(rows); // update inputValue state

    //     // update equation array immediately
    //     const newEquations = rows.map((row) => {
    //         const input = row.value.replace(/\s+/g, ''); // remove extra spaces

    //         // check if the input is just y (invalid)
    //         if (input === 'y') {
    //             console.log("Invalid input:", input);
    //             return null; // skip this equation
    //         }

    //         if (isValidEquation(input)) {
    //             let formattedEquation = input;
    //             if (!input.includes('=')) {
    //                 formattedEquation = `y=${input}`; // Format as y = expression if no =
    //             }
    //             return formattedEquation;
    //         } else {
    //             return null; // skip invalid equations
    //         }
    //     });

    //     // filter out null entries (invalid or skipped equations)
    //     const filteredEquations = newEquations.filter(eq => eq !== null);
    //     // setEquation(filteredEquations);
    // };

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
                    <InputList setEquation={setEquation} equation={equation} hidden={hidden} setHidden={setHidden} />
                    <div className="resizer" ref={resizerRef} onMouseDown={handleMouseDown} />
                </div>
            )}

            <div className='graph-section' style={{ width: graphWidth }}>
                <GraphCanvas equation={equation} graphWidth={graphWidth} graphHeight={graphHeight}/>
                {hidden && (
                    <button className='input-list__show-btn' onClick={() => setHidden(false)}>
                        <img src={DoubleRightIcon} alt="Show Menu Bar" style={{ width: '50%', height: '50%' }} draggable="false"/>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MainPage;
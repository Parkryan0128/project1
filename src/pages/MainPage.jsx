import React, { useState, useEffect, useRef } from 'react';
import InputList from '../components/InputList';
import GraphCanvas from '../components/GraphCanvas';
import './MainPage.css';

const MainPage = () => {
    const [hidden, setHidden] = useState(false);
    const [graphWidth, setGraphWidth] = useState(window.innerWidth * 0.70);
    const [inputValue, setInputValues] = useState([]);
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

    const handleInputChange = (rows) => {
        setInputValues(rows);
        console.log('userInput: ', rows);
    }

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
                    <InputList hidden={hidden} setHidden={setHidden} setGraphWidth={setGraphWidth} onInputChange={handleInputChange}/>
                    <div className="resizer" ref={resizerRef} onMouseDown={handleMouseDown} />
                </div>
            )}

            <div className='graph-section' style={{ width: graphWidth }}>
                <GraphCanvas graphWidth={graphWidth} />
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
import React, { useState, useEffect } from 'react';
import InputList from '../components/InputList';
import GraphCanvas from '../components/GraphCanvas';
import './MainPage.css';

const MainPage = () => {
    const [hidden, setHidden] = useState(false);
    const [graphWidth, setGraphWidth] = useState(window.innerWidth * 0.70);

    console.log(window.innerWidth);
    useEffect(() => {
        setGraphWidth(window.innerWidth * (hidden ? 1 : 0.7))
    }, [hidden]);

    return (
        <div className='graph-layout'>
            {!hidden && (
                <div className='input-section'>
                    <InputList hidden={hidden} setHidden={setHidden} setGraphWidth={setGraphWidth}/>
                </div>
            )}

            <div className='graph-section' style={{ width: hidden ? '100%' : '70%' }}>
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
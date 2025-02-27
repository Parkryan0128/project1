import React, { useState } from 'react';
import PlusIcon from '../assets/plus-toolbar.png';
import DoubleLeftIcon from '../assets/double_left.png';
import RemoveIcon from '../assets/x.png';
import Input from '../components/Input.jsx'
import './InputList.css'

function InputList({ hidden, setHidden, equation, setEquation }) {

    const addRows = () => {
        setEquation([...equation, {expression: "", color: "black"}]);
    };

    const generateInputRows = equation.map((item, index) => {
        return (
            <div className='input-list__row' key={index}>
                <Input setEquation={setEquation} equation={equation} index={index}/>
            </div> 
        );
    });

    const prepareSingleInputRow = () => {
        const lastIndex = equation.length + 1;
        return (
            <div className='input-list__row' key={lastIndex}>
                <div className='input-list__index'>{lastIndex}</div>
                <div className='input-list__wrapper' onClick={addRows}>
                    <input
                        type='text'
                        className='input-list__field'
                        placeholder='Add a new row'
                    />   
                </div>
            </div>)
    }

    const isHidden = () => {
        setHidden(true)
    }

    return (
        <div className='input-list'>    
            <div className={hidden ? 'input-list__row--hidden' : 'input-list__row--display'}>
                <div className='input-list__main-container'>
                    <div className='input-list__container'> 
                        <div className='input-list__tool-bar'>
                            <button className='input-list__btn' onClick={addRows}>
                                <img src={PlusIcon} alt="Add Row" style={{ width: '50%', height: '50%' }} draggable="false"/>
                            </button>
                            <button className='input-list__btn' onClick={isHidden}>
                                <img src={DoubleLeftIcon} alt="Hide Menu Bar" style={{ width: '50%', height: '50%' }} draggable="false"/>
                            </button>
                        </div>
                    </div>

                    {generateInputRows}
                    {prepareSingleInputRow()}

                </div>
            </div>
        </div>
    );
}
export default InputList
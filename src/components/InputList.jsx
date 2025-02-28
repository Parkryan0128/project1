import React, { useState } from 'react';
import PlusIcon from '../assets/plus-toolbar.png';
import DoubleLeftIcon from '../assets/double_left.png';
import RemoveIcon from '../assets/x.png';
import './InputList.css'

function InputList({ isHidden, onInputChange, inputValue}) {

    const addRows = () => {
        const newIndex = inputValue.length + 1;
        const updatedRows = [...inputValue, {index: newIndex, value: ""}];
        onInputChange(updatedRows);
    };

    const removeRows = (index) => {
        let updatedRows = inputValue.filter(row => row.index !== index);
        updatedRows = updateIndexNumber(updatedRows);

        if (updatedRows.length === 0) {
            updatedRows = [{index: 1, value: ""}];
        }
        
        onInputChange(updatedRows);
    };

    const updateIndexNumber = (rows) => {
        return rows.map((row, idx) => ({
            ...row,
            index: idx + 1,
        }));
    };

    const handleInputChange = (index, newValue) => {
        const updatedRows = inputValue.map(row =>
            row.index === index ? {...row, value: newValue} : row
        );

        if (onInputChange) {
            onInputChange(updatedRows);
        }
    };
    
    const generateInputRows = inputValue.map((row) => {
        return (
            <div className='input-list__row' key={row.index}>
                <div className='input-list__index'>{row.index}</div>

                <div className='input-list__wrapper'>
                    <input
                        type= 'text'
                        className='input-list__field'
                        placeholder=''
                        value={row.value}
                        onChange={(e) => handleInputChange(row.index, e.target.value)}
                    />
                    <button className='input-list__remove-btn' onClick={() => removeRows(row.index)}>
                        <img src={RemoveIcon} alt="Remove Inputfield" style={{ width: '70%', height: '70%' }} draggable="false"/>
                    </button>
                </div>
            </div> 
        );
    });

    const prepareSingleInputRow = () => {
        const lastIndex = inputValue.length + 1;

        return (
            <div className='input-list__row' key={lastIndex}>
                <div className='input-list__index'>{lastIndex}</div>
                <div className='input-list__wrapper' onClick={addRows}>
                    <input
                        type='text'
                        className='input-list__field'
                    />   
                </div>
            </div>)
    }

    return (
        <div className='input-list'>    
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
    );
}
export default InputList
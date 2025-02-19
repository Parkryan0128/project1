import React, { useState } from 'react';
import './InputList.css'

function InputList({ hidden, setHidden }) {
    const [rows, setRows] = useState([{index: 1, value: ""}]);
    // const [hidden, setHidden] = useState(false);

    const addRows = () => {
        const newIndex = rows.length + 1;
        setRows([...rows, {index: newIndex, value: ""}]);
    };

    const removeRows = (index) => {
        const filteredRows = rows.filter(row => row.index !== index);
        const updatedRows = updateIndexNumber(filteredRows);

        if (updatedRows.length === 0) {
            setRows([{index: 1, value: ""}]);
        } else {
            setRows(updatedRows);
        }
    };

    const updateIndexNumber = (rows) => {
        return rows.map((row, idx) => ({
            ...row,
            index: idx + 1,
        }));
    };

    const handleInputChange = (index, newValue) => {
        const updatedRows = rows.map(row =>
            row.index === index ? {...row, value: newValue} : row
        );
        
        setRows(updatedRows);
    };

    const generateInputRows = rows.map((row) => {
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
                    <button className='input-list__remove-btn' onClick={() => removeRows(row.index)}>X</button>
                </div>
            </div> 
        );
    });

    const prepareSingleInputRow = () => {
        const lastIndex = rows.length + 1;

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

    const isShown = () => {
        setHidden(false)
    }

    const renderShowBtn = () => {
        if (hidden) {
            return (
                <button className='input-list__show-btn' onClick={isShown}>
                    {'>>'}
                </button>
            );
        }
        return null;
    };

    return (
        <div className='input-list'>    
            <div className={hidden ? 'input-list__row--hidden' : 'input-list__row--display'}>
                <div className='input-list__main-container'>
                    <div className='input-list__container'> 
                        <div className='input-list__tool-bar'>
                            <button className='input-list__btn' onClick={addRows}>+</button>
                            <button className='input-list__btn' onClick={isHidden}>
                                {'<<'}
                            </button>
                        </div>
                    </div>

                    {generateInputRows}
                    {prepareSingleInputRow()}

                </div>
            </div>
            {renderShowBtn()}
        </div>
    );
}
export default InputList
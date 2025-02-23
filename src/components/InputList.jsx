import React, { useState } from 'react';
import PlusIcon from '../assets/plus-toolbar.png';
import DoubleLeftIcon from '../assets/double_left.png';
import RemoveIcon from '../assets/x.png';
import Input from '../components/Input.jsx'
import './InputList.css'

function InputList({ hidden, setHidden, onInputChange, equation, setEquation }) {
    // const [rows, setRows] = useState([{index: 1, value: ""}]);

    const addRows = () => {
        setEquation([...equation, {expression: "", color: "black"}]);
    };

    // const removeRows = (index) => {
    //     let updatedRows = rows.filter(row => row.index !== index);
    //     updatedRows = updateIndexNumber(updatedRows);

    //     if (updatedRows.length === 0) {
    //         updatedRows = [{index: 1, value: ""}];
    //     }
        
    //     setRows(updatedRows);
    //     onInputChange(updatedRows);
    // };

    // const updateIndexNumber = (rows) => {
    //     return rows.map((row, idx) => ({
    //         ...row,
    //         index: idx + 1,
    //     }));
    // };

    // const handleInputChange = (index, newValue) => {
    //     const updatedRows = rows.map(row =>
    //         row.index === index ? {...row, value: newValue} : row
    //     );
        
    //     setRows(updatedRows);

    //     if (onInputChange) {
    //         onInputChange(updatedRows);
    //     }
    // };

    const generateInputRows = equation.map((item, index) => {
        return (
            <div className='input-list__row' key={index}>
                <Input setEquation={setEquation} equation={equation} index={index}/>
                {/* <div className='input-list__index'>{row.index}</div>

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
                </div> */}
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
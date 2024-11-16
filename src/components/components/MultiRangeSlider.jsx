import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "../styles/multiRangeSlider.css";

const MultiRangeSlider = ({ min, max, onChange }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);

    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    useEffect(() => {
        if (isButtonClicked) {
            onChange({ min: minVal, max: maxVal });
            setIsButtonClicked(false);
        }
    }, [isButtonClicked]);

    const handleMinInputChange = (event) => {
        const inputValue = Number(event.target.value);

        if (inputValue < min) {
            setMinVal(min);
            minValRef.current = min;
        } else if (inputValue >= max) {
            setMinVal(max - 1);
            minValRef.current = max - 1;
        } else if (inputValue >= maxVal) {
            setMinVal(maxVal - 1);
            minValRef.current = maxVal - 1;
        } else {
            setMinVal(inputValue);
            minValRef.current = inputValue;
        }
    };

    const handleMaxInputChange = (event) => {
        const inputValue = Number(event.target.value);

        if (inputValue > max) {
            setMaxVal(max);
            maxValRef.current = max;
        } else if (inputValue <= min) {
            setMaxVal(min + 1);
            maxValRef.current = min + 1;
        } else if (inputValue <= minVal) {
            setMaxVal(minVal + 1);
            maxValRef.current = minVal + 1;
        } else {
            setMaxVal(inputValue);
            maxValRef.current = inputValue;
        }
    };

    const handleButtonClick = () => {
        setIsButtonClicked(true);
    };

    return (
        <div>
            <div className="inputs-container">
                <div className="input-group">
                    <input
                        type="number"
                        value={minVal}
                        onChange={handleMinInputChange}
                        min={min}
                        max={max}
                    />
                </div>
                <div className="input-group">
                    <input
                        type="number"
                        value={maxVal}
                        onChange={handleMaxInputChange}
                        min={min}
                        max={max}
                    />
                </div>
                <button className="ok-button" onClick={handleButtonClick}>OK</button>
            </div>
            <div className="container-slider">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    onChange={(event) => {
                        const value = Math.min(Number(event.target.value), maxVal - 1);
                        setMinVal(value);
                        minValRef.current = value;
                    }}
                    className="thumb thumb--left"
                    style={{zIndex: minVal > max - 100 && "5"}}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    onChange={(event) => {
                        const value = Math.max(Number(event.target.value), minVal + 1);
                        setMaxVal(value);
                        maxValRef.current = value;
                    }}
                    className="thumb thumb--right"
                />

                <div className="slider">
                    <div className="slider__track"/>
                    <div ref={range} className="slider__range"/>
                </div>
            </div>
        </div>
    );
};

MultiRangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default MultiRangeSlider;

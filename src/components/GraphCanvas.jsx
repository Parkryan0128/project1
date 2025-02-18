import React, { useRef, useEffect, useState } from 'react';

function GraphCanvas() {
    const canvasRef = useRef(null);
    const isDragging = useRef(false)
    const [width, setWidth] = useState(1000);
    const [height, setHeight] = useState(1000);
    const [equation, setEquation] = useState('y = Math.sqrt(x)');
    const [origin, setOrigin] = useState({ x: width / 2, y: height / 2 })
    const [scale, setScale] = useState(100);
    const lastMousePos = useRef({ x: 0, y: 0 });


    // Draw Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);

        const dpr = window.devicePixelRatio || 1;
        if (dpr !== 1) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        }

        drawGrid(ctx, width, height, origin, scale);
        drawAxis(ctx, origin, width, height);
        drawLabel(ctx, origin, width, height, scale);
        drawGraph(ctx, origin, width, scale, equation);

    }, [equation, origin, scale]);

    // Handle Panning
    useEffect(() => {
        const canvas = canvasRef.current;

        const handleMouseDown = (e) => {
            isDragging.current = true;
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseMove = (e) => {
            if (!isDragging.current) return;

            const deltaX = e.clientX - lastMousePos.current.x;
            const deltaY = e.clientY - lastMousePos.current.y;

            // Update the origin state to pan the graph
            setOrigin((prev) => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY,
            }));

            // Update the last mouse position
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => {
            if (isDragging.current) {
                isDragging.current = false;
            }
        };

        const handleMouseLeave = () => {
            if (isDragging.current) {
                isDragging.current = false;
            }
        };

        // Attach event listeners
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseLeave);


        // Clean up event listeners on component unmount
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [origin]);


    // Handle Zoom in and Zoom out
    useEffect(() => {
        const canvas = canvasRef.current;
        const handleWheel = (e) => {
            e.preventDefault();

            const zoomIntensity = 0.001; // Adjust for sensitivity
            const delta = e.deltaY * zoomIntensity;
            let newScale = scale * (1 - delta);

            // Limit scale to prevent it from getting too small or too large
            if (newScale < 2.00e-9 || newScale > 5000000) return;

            // Get mouse position relative to canvas
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const THRESHOLD_PX = 75;
            const distX = Math.abs(mouseX - origin.x);
            const distY = Math.abs(mouseY - origin.y);
            let anchorX = mouseX;
            let anchorY = mouseY;
            if (distX < THRESHOLD_PX && distY < THRESHOLD_PX) {
                anchorX = origin.x;
                anchorY = origin.y;
              }

            // Calculate the new origin to zoom towards mouse position
            const zoomFactor = newScale / scale;
            const newOrigin = {
              x: anchorX - zoomFactor * (anchorX - origin.x),
              y: anchorY - zoomFactor * (anchorY - origin.y),
            };
            setScale(newScale);
            setOrigin(newOrigin);
        };

        canvas.addEventListener('wheel', handleWheel);

        // Clean up
        return () => {
            canvas.removeEventListener('wheel', handleWheel);
        };
    }, [scale, origin]);


    return (
        <div>
            <canvas
                ref={canvasRef}
                id="preview"
                width={width} // Canvas width in pixels
                height={height} // Canvas height in pixels
                style={{ border: '1px solid #ccc' }}
            />
        </div>
    );
}

function roundToDecimals(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round((num + Number.EPSILON) * factor) / factor;
}

function formatNumber(num) {
    // Check if the number is finite
    if (!isFinite(num)) {
        return num.toString();
    }

    // Define thresholds for large numbers
    const LARGE_THRESHOLD = 99999;
    const SMALL_THRESHOLD = -99999;

    // Check if the number exceeds the large thresholds
    if (num > LARGE_THRESHOLD || num < SMALL_THRESHOLD) {
        // Convert to scientific notation with 5 decimal places
        return num.toExponential(1);
    }

    // Round the number to 5 decimal places
    const roundedNum = roundToDecimals(num, 5);

    // Define a small epsilon for floating-point comparison
    const epsilon = 1e-10;

    // Compare the rounded number with the original number
    if (Math.abs(num - roundedNum) < epsilon) {
        // If the difference is less than epsilon, return the rounded number as a string
        return roundedNum.toString();
    } else {
        // If the number has more than 5 decimal places, convert to scientific notation with 5 decimal places
        return num.toExponential(1);
    }
}

function getNiceNumber(value) {
    if (value === 0) return 0;
    const exponent = Math.floor(Math.log10(value));
    const fraction = value / Math.pow(10, exponent);

    let niceFraction;

    if (fraction <= 1) {
        niceFraction = 1;
    } else if (fraction <= 2) {
        niceFraction = 2;
    } else if (fraction <= 5) {
        niceFraction = 5;
    } else {
        niceFraction = 10;
    }

    const niceNumber = niceFraction * Math.pow(10, exponent);
    return roundToDecimals(niceNumber, 10);
}

const getGridSteps = (scale) => {
    const desiredMajorPixelSpacing = 100; // Desired pixels between major grid lines
    const desiredMinorPixelSpacing = 20;  // Desired pixels between minor grid lines

    const approximateMajorStep = desiredMajorPixelSpacing / scale;
    const approximateMinorStep = desiredMinorPixelSpacing / scale;

    const majorStep = getNiceNumber(approximateMajorStep);
    const minorStep = getNiceNumber(approximateMinorStep);

    return { majorStep, minorStep };
};

const drawGrid = (ctx, width, height, origin, scale) => {
    const { majorStep, minorStep } = getGridSteps(scale);
    const majorGridSpacing = majorStep * scale;
    const minorGridSpacing = minorStep * scale;
    ctx.strokeStyle = '#DCDCDC'; // Light grey for grid lines
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    // Vertical minor grid lines
    for (let x = origin.x % minorGridSpacing; x <= width; x += minorGridSpacing) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
    }
    for (let x = origin.x % minorGridSpacing; x >= 0; x -= minorGridSpacing) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
    }

    // Horizontal minor grid lines
    for (let y = origin.y % minorGridSpacing; y <= height; y += minorGridSpacing) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
    }
    for (let y = origin.y % minorGridSpacing; y >= 0; y -= minorGridSpacing) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
    }

    ctx.stroke();

    // Draw major grid lines (darker color)
    ctx.strokeStyle = '#808080'; // Slightly darker grey for major grid lines
    ctx.lineWidth = 0.5;

    ctx.beginPath();

    // Vertical major grid lines
    for (let x = origin.x % majorGridSpacing; x <= width; x += majorGridSpacing) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
    }
    for (let x = origin.x % majorGridSpacing; x >= 0; x -= majorGridSpacing) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
    }

    // Horizontal major grid lines
    for (let y = origin.y % majorGridSpacing; y <= height; y += majorGridSpacing) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
    }
    for (let y = origin.y % majorGridSpacing; y >= 0; y -= majorGridSpacing) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
    }

    ctx.stroke();
}

const drawAxis = (ctx, origin, width, height) => {
    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(width, origin.y);
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, height);
    ctx.strokeStyle = 'black'; // Grey color for axes
    ctx.lineWidth = 2; // Thickness of the axes
    ctx.stroke();
}


const drawGraph = (ctx, origin, width, scale, equation) => {
    const rhsExpression = equation.split('=')[1].trim();
    const yFunction = new Function('x', `return ${rhsExpression}`);

    ctx.beginPath();

    let wasValid = false;

    for (let i = 0; i <= width; i++) {
        const xValue = (i - origin.x) / scale;
        let yValue;

        try {
            yValue = yFunction(xValue);
            if (!Number.isFinite(yValue)) throw new Error('Invalid y');
        } catch {
            wasValid = false;
            continue;
        }

        const canvasY = origin.y - yValue * scale;

        if (wasValid) {
            ctx.lineTo(i, canvasY);
        } else {
            ctx.moveTo(i, canvasY);
        }

        wasValid = true;
    }

    ctx.stroke();
}



const drawLabel = (ctx, origin, width, height, scale) => {
    const { majorStep, minorStep } = getGridSteps(scale);
    const EPSILON = 1e-5
    ctx.fillStyle = '#000000'; // Black color for text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `12px Arial`;

    // Calculate the range of labels to display on the X-axis
    const xStartUnit = Math.ceil((-origin.x) / scale / majorStep) * majorStep;
    const xEndUnit = Math.floor((width - origin.x) / scale / majorStep) * majorStep;

    // Draw labels on the X-axis
    for (let x = xStartUnit; x <= xEndUnit; x += majorStep) {
        if (Math.abs(x) < EPSILON) continue; // Skip origin to prevent duplicate labeling
        const canvasX = origin.x + x * scale;
        const canvasY = origin.y + 15; // Position below the X-axis
        const label = formatNumber(x)
        ctx.fillText(label, canvasX, canvasY);
    }

    // Calculate the range of labels to display on the Y-axis
    const yStartUnit = Math.ceil((-origin.y) / scale / majorStep) * majorStep;
    const yEndUnit = Math.floor((height - origin.y) / scale / majorStep) * majorStep;

    // Draw labels on the Y-axis
    for (let y = yStartUnit; y <= yEndUnit; y += majorStep) {
        if (Math.abs(y) < EPSILON) continue; // Skip origin to prevent duplicate labeling
        const canvasY = origin.y + y * scale;
        const canvasX = origin.x - 15; // Position to the left of the Y-axis
        const label = formatNumber(-y)
        ctx.fillText(label, canvasX, canvasY);
    }

    // Label at the origin
    ctx.fillText('0', origin.x - 15, origin.y + 15);
}


export default GraphCanvas;
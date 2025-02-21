import React, { useRef, useEffect, useState } from 'react';

function GraphCanvas({ graphWidth, graphEquation }) {
    const canvasRef = useRef(null);
    const [width, setWidth] = useState(1000);
    const [height, setHeight] = useState(1000);
    const [equation, setEquation] = useState('y = x ** 3');
    const [origin, setOrigin] = useState({ x: 500, y: 500 })
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [scale, setScale] = useState(100);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);

    useEffect(() => {
        setWidth(graphWidth);
        console.log(width);
    }, [graphWidth]);

    // useEffect(() => {
    //     setEquation(graphEquation);
    // }, [graphEquation]);
    
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
        drawAxis(ctx, origin, width, height, scale);
        drawLabel(ctx, origin, width, height, scale);
        // Draw all graphs using the equations array
        graphEquation.forEach((eq) => {
            drawGraph(ctx, origin, width, height, scale, eq, position);
        });
    }, [graphEquation, origin, scale, width]);


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

        // Set initial cursor style
        canvas.style.cursor = 'grab';

        // Clean up event listeners on component unmount
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [origin]);


    useEffect(() => {
        const canvas = canvasRef.current;
        const handleWheel = (e) => {
            e.preventDefault();

            const zoomIntensity = 0.05; // Adjust for sensitivity
            const delta = e.deltaY * zoomIntensity;
            let newScale = scale * (1 - delta);
            console.log(newScale)

            // Limit scale to prevent it from getting too small or too large
            if (newScale < 20 || newScale > 1000) return;

            // Get mouse position relative to canvas
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate the new origin to zoom towards mouse position
            const zoomFactor = newScale / scale;
            const newOrigin = {
                x: mouseX - zoomFactor * (mouseX - origin.x),
                y: mouseY - zoomFactor * (mouseY - origin.y),
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

const getGridSteps = (scale) => {
    // Define thresholds for different scale ranges
    if (scale >= 800) {
        return { majorStep: 1, minorStep: 0.1 };
    } else if (scale >= 400) {
        return { majorStep: 1, minorStep: 0.2 }; // High zoom: more minor lines
    } else if (scale >= 200) {
        return { majorStep: 1, minorStep: 0.5 };
    } else if (scale >= 100) {
        return { majorStep: 1, minorStep: 0.5 };
    } else if (scale >= 50) {
        return { majorStep: 2, minorStep: 1 }; // Lower zoom: fewer major lines
    } else if (scale >= 25) {
        return { majorStep: 5, minorStep: 1 };
    } else {
        return { majorStep: 10, minorStep: 2 }; // Very low zoom: sparse grid
    }
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

const drawAxis = (ctx, origin, width, height, scale) => {
    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(width, origin.y);
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, height);
    ctx.strokeStyle = 'black'; // Grey color for axes
    ctx.lineWidth = 2; // Thickness of the axes
    ctx.stroke();
}


const drawGraph = (ctx, origin, width, height, scale, equation, position) => {
    const xMin = position.x - width / 2;
    const xMax = position.x + width / 2;
    const step = 0.01; // Step size for x-values

    let firstPoint = true;

    const rhsTest = equation.split('=')[1].trim();
    let yFunction = new Function('x', `return ${rhsTest}`);

    ctx.beginPath(); // Start a new path

    for (let x = xMin; x <= xMax; x += step) {
        let y;
        try {
            y = yFunction(x);
            if (typeof y !== 'number' || !isFinite(y)) {
                throw new Error('Non-finite y value');
            }
        } catch (err) {
            continue;
        }
        // let y = yFunction(x)
        // Convert mathematical coordinates to canvas coordinates


        const canvasX = origin.x + x * scale;
        const canvasY = origin.y - y * scale;

        if (firstPoint) {
            ctx.moveTo(canvasX, canvasY);
            firstPoint = false;
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }

    ctx.stroke();
}



const drawLabel = (ctx, origin, width, height, scale) => {
    const { majorStep, minorStep } = getGridSteps(scale);
    ctx.fillStyle = '#000000'; // Black color for text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `12px Arial`;

    // Calculate the range of labels to display on the X-axis
    const xStartUnit = Math.ceil((-origin.x) / scale / majorStep) * majorStep;
    const xEndUnit = Math.floor((width - origin.x) / scale / majorStep) * majorStep;

    // Draw labels on the X-axis
    for (let x = xStartUnit; x <= xEndUnit; x += majorStep) {
        if (x === 0) continue; // Skip origin to prevent duplicate labeling
        const canvasX = origin.x + x * scale;
        const canvasY = origin.y + 15; // Position below the X-axis
        ctx.fillText(x.toString(), canvasX, canvasY);
    }

    // Calculate the range of labels to display on the Y-axis
    const yStartUnit = Math.ceil((-origin.y) / scale / majorStep) * majorStep;
    const yEndUnit = Math.floor((height - origin.y) / scale / majorStep) * majorStep;

    // Draw labels on the Y-axis
    for (let y = yStartUnit; y <= yEndUnit; y += majorStep) {
        if (y === 0) continue; // Skip origin to prevent duplicate labeling
        const canvasY = origin.y + y * scale;
        const canvasX = origin.x - 15; // Position to the left of the Y-axis
        ctx.fillText((-y).toString(), canvasX, canvasY);
    }

    // Label at the origin
    ctx.fillText('0', origin.x - 15, origin.y + 15);
}


export default GraphCanvas;
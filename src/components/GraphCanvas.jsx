import React, { useRef, useEffect, useState } from 'react';

function GraphCanvas() {
    const canvasRef = useRef(null);
    const [width, setWidth] = useState(1000);
    const [height, setHeight] = useState(1000);
    const [equation, setEquation] = useState('y = x ** 2');
    const [error, setError] = useState('');
    const [origin, setOrigin] = useState({ x: 500, y: 500 })
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const [scale, setScale] = useState(100);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false)

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);

        // const dpr = window.devicePixelRatio || 1;
        // if (dpr !== 1) {
        //     canvas.width = width * dpr;
        //     canvas.height = height * dpr;
        //     canvas.style.width = `${width}px`;
        //     canvas.style.height = `${height}px`;
        //     ctx.scale(dpr, dpr);
        // }

        drawGrid(ctx, width, height, origin, scale);
        drawAxis(ctx, origin, width, height, scale);
        drawLabel(ctx, origin, width, height, scale);
        drawGraph(ctx, origin, width, height, scale, equation, position);

    }, [equation, origin, scale]);


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
            console.log(origin.x);
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
            const newScale = scale * (1 - delta);

            // Limit scale to prevent it from getting too small or too large
            if (newScale < 10 || newScale > 200) return;

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

const drawGrid = (ctx, width, height, origin, scale) => {

    ctx.strokeStyle = '#F0F0F0'; // Light grey for grid lines
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Vertical lines
    for (let x = origin.x % scale; x <= width; x += scale) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
    }
    for (let x = origin.x % scale; x >= 0; x -= scale) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
    }

    // Horizontal lines
    for (let y = origin.y % scale; y <= height; y += scale) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
    }
    for (let y = origin.y % scale; y >= 0; y -= scale) {
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
    const step = 0.001; // Step size for x-values

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
    ctx.fillStyle = '#000000'; // Black color for text
    ctx.font = '12px Arial';    // Font style and size
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Determine label spacing based on scale
    let labelSpacing = 1; // In units
    if (scale < 30) labelSpacing = 5;
    else if (scale < 50) labelSpacing = 10;
    else labelSpacing = 1;

    // Determine the range of x-values visible on the canvas
    const xMin = Math.ceil((-origin.x) / scale / labelSpacing) * labelSpacing;
    const xMax = Math.floor((width - origin.x) / scale / labelSpacing) * labelSpacing;

    // Draw labels on the X-axis
    for (let x = xMin; x <= xMax; x += labelSpacing) {
        if (x != 0) {
            const canvasX = origin.x + x * scale;
            const canvasY = origin.y + 15; // Position below the X-axis
            ctx.fillText(x.toString(), canvasX, canvasY);
        }
    }

    // Determine the range of y-values visible on the canvas
    const yMin = Math.ceil((-origin.y) / scale / labelSpacing) * labelSpacing;
    const yMax = Math.floor((height - origin.y) / scale / labelSpacing) * labelSpacing;

    for (let y = yMin; y <= yMax; y += labelSpacing) {
        if (y != 0) {
            const canvasY = origin.y + y * scale;
            const canvasX = origin.x - 15; // Position to the right of the Y-axis
            // Only draw labels within canvas bounds
            ctx.fillText((-y).toString(), canvasX, canvasY);
        }
    }

    // Label at the origin
    ctx.fillText('0', origin.x - 15, origin.y + 15);
}


export default GraphCanvas;
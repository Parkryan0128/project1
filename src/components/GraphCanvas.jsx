import React, { useRef, useEffect, useState } from 'react';

function GraphCanvas() {
    const canvasRef = useRef(null);
    const [equation, setEquation] = useState('y = x ** 2');
    const [error, setError] = useState('');
    const [origin, setOrigin] = useState({ x: 400, y: 400 })
    const [scale, setScale] = useState(50);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false)



    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
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
        drawGraph(ctx, origin, scale, equation);

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
    }, []);


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

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
                width={800} // Canvas width in pixels
                height={800} // Canvas height in pixels
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


const drawGraph = (ctx, origin, scale, equation) => {
    const xMin = -10 *origin.x / scale; // e.g., -800/50 = -16 units
    const xMax = 10* origin.x / scale; // 50 = 16 units
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
        const canvasY = origin.y - y * scale; // Invert y-axis

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
    const numberOfLabels = Math.floor(width / scale / 2); // Dynamic based on scale and canvas size

    // Draw labels on X-axis
    for (let i = 1; i <= numberOfLabels; i++) {
        const xPos = origin.x + i * scale;
        const label = i;
        ctx.fillText(label.toString(), xPos, origin.y + 15); // Positioned below X-axis

        const xNegPos = origin.x - i * scale;
        const labelNeg = -i;
        ctx.fillText(labelNeg.toString(), xNegPos, origin.y + 15); // Positioned below X-axis
    }

    // Draw labels on Y-axis
    for (let i = 1; i <= numberOfLabels; i++) {
        const yPos = origin.y - i * scale;
        const label = i;
        ctx.fillText(label.toString(), origin.x + 15, yPos); // Positioned to the right of Y-axis

        const yNegPos = origin.y + i * scale;
        const labelNeg = -i;
        ctx.fillText(labelNeg.toString(), origin.x + 15, yNegPos); // Positioned to the right of Y-axis
    }

    // Label at the origin
    ctx.fillText('0', origin.x - 15, origin.y + 15);
}


export default GraphCanvas;
import React, { useRef, useEffect, useState } from 'react';

function GraphCanvas() {
    const canvasRef = useRef(null);
    const [equation, setEquation] = useState('y = 2* x');
    const [error, setError] = useState('');
    const [origin, setOrigin] = useState({ x:400, y: 400 })
    const isDragging = useRef(false)
    const lastMousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const originX = width / 2;
        const originY = height / 2;
        const scale = 50;
        ctx.clearRect(0, 0, width, height);

        const dpr = window.devicePixelRatio || 1;
        if (dpr !== 1) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        }

        drawGrid(ctx, width, height, originX, originY, scale);
        drawAxis(ctx, origin.x, origin.y, width, height, scale);
        // drawAxis(ctx, origin.x, origin.y, width, height, scale);
        drawLabel(ctx, origin.x, origin.y, width, height, scale);
        drawGraph(ctx, origin.x, origin.y, width, height, scale, equation);

        const handleMouseDown = (e) => {
            isDragging.current = true;
            lastMousePos.current = { x: e.clientX, y: e.clientY };
            canvas.style.cursor = 'grabbing';
        };

        const handleMouseMove = (e) => {
            if (!isDragging.current) return;

            const deltaX = e.clientX - lastMousePos.current.x;
            const deltaY = e.clientY - lastMousePos.current.y;

            setOrigin((prev) => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY,
            }));

            lastMousePos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => {
            if (isDragging.current) {
                isDragging.current = false;
                canvas.style.cursor = 'grab';
            }
        };

        const handleMouseLeave = () => {
            if (isDragging.current) {
                isDragging.current = false;
                canvas.style.cursor = 'grab';
            }
        };
        canvas.style.cursor = 'grab';

        const handleTouchStart = (e) => {
            if (e.touches.length === 1) { // Single touch
                isDragging.current = true;
                const touch = e.touches[0];
                lastMousePos.current = { x: touch.clientX, y: touch.clientY };
                canvas.style.cursor = 'grabbing';
            }
        };

        const handleTouchMove = (e) => {
            if (!isDragging.current || e.touches.length !== 1) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - lastMousePos.current.x;
            const deltaY = touch.clientY - lastMousePos.current.y;

            setOrigin((prev) => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY,
            }));

            lastMousePos.current = { x: touch.clientX, y: touch.clientY };

            // Prevent scrolling
            e.preventDefault();
        };

        const handleTouchEnd = () => {
            if (isDragging.current) {
                isDragging.current = false;
                canvas.style.cursor = 'grab';
            }
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);
        canvas.addEventListener('touchcancel', handleTouchEnd);

        // Clean up event listeners on unmount
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mouseleave', handleMouseLeave);

            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('touchcancel', handleTouchEnd);
        };

    }, [equation, origin]);


    return (
        <div>
            <canvas
                ref={canvasRef}
                id="preview"
                width={400} // Canvas width in pixels
                height={400} // Canvas height in pixels
                style={{ border: '1px solid #ccc' }}
            />
        </div>
    );
}

const drawGrid = (ctx, width, height, originX, originY, scale) => {
    // Draw X-axis
    // ctx.beginPath();
    // for (let i = 0; i < 40; i++) {
    //     ctx.moveTo(0, i * (height / 40));
    //     ctx.lineTo(width, i * (height / 40));
    //     ctx.moveTo(i * (width / 40), 0);
    //     ctx.lineTo(i * (width / 40), height);
    // }
    // ctx.strokeStyle = '#F0F0F0'; // Grey color for axes
    // ctx.lineWidth = 1; // Thickness of the axes
    // ctx.stroke();

    // ctx.beginPath();
    // for (let i = 0; i < 8; i++) {
    //     ctx.moveTo(i * width / 8, 0);
    //     ctx.lineTo(i * width / 8, height);
    //     ctx.moveTo(0, i * height / 8);
    //     ctx.lineTo(width, i * height / 8);
    // }
    // ctx.strokeStyle = '#D3D3D3'; // Grey color for axes
    // ctx.lineWidth = 1; // Thickness of the axes
    // ctx.stroke();


    ctx.strokeStyle = '#F0F0F0'; // Light grey for grid lines
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Vertical lines
    for (let x = originX; x <= width; x += scale) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
    }
    for (let x = originX; x >= 0; x -= scale) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
    }

    // Horizontal lines
    for (let y = originY; y <= height; y += scale) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
    }
    for (let y = originY; y >= 0; y -= scale) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
    }

    ctx.stroke();
}

const drawAxis = (ctx, originX, originY, width, height, scale, equation) => {
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.strokeStyle = 'black'; // Grey color for axes
    ctx.lineWidth = 2; // Thickness of the axes
    ctx.stroke();
    // ctx.strokeStyle = '#000000'; // Black for axes
    // ctx.lineWidth = 2;
    // ctx.beginPath();

    // // X-axis
    // ctx.moveTo(0, originY + 0.5);
    // ctx.lineTo(width, originY + 0.5);

    // // Y-axis
    // ctx.moveTo(originX + 0.5, 0);
    // ctx.lineTo(originX + 0.5, height);
    // ctx.stroke();
}


const drawGraph = (ctx, originX, originY, width, height, scale, equation) => {
    const xMin = -originX / scale; // e.g., -800/50 = -16 units
    const xMax = originX / scale; // 50 = 16 units
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
            // Skip this x if y cannot be computed
            continue;
        }
        // let y = yFunction(x)
        // Convert mathematical coordinates to canvas coordinates
        const canvasX = originX + x * scale;
        const canvasY = originY - y * scale; // Invert y-axis

        if (firstPoint) {
            ctx.moveTo(canvasX, canvasY);
            firstPoint = false;
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }

    ctx.stroke();
}



const drawLabel = (ctx, originX, originY, width, height, scale, equation) => {
    ctx.fillStyle = '#000000'; // Black color for text
    ctx.font = '12px Arial';    // Font style and size
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const numberOfLabels = 8;
    for (let i = 1; i <= numberOfLabels; i++) {
        const xPos = originX + i * scale;
        const label = i;
        ctx.fillText(label.toString(), xPos, originY + 15); // Positioned below X-axis

        const xNegPos = originX - i * scale;
        const labelNeg = -i;
        ctx.fillText(labelNeg.toString(), xNegPos, originY + 15); // Positioned below X-axis
    }

    // Draw labels on Y-axis
    for (let i = 1; i <= numberOfLabels; i++) {
        const yPos = originY - i * scale;
        const label = i;
        ctx.fillText(label.toString(), originX - 15, yPos); // Positioned to the right of Y-axis

        const yNegPos = originY + i * scale;
        const labelNeg = -i;
        ctx.fillText(labelNeg.toString(), originX - 15, yNegPos); // Positioned to the right of Y-axis
    }

    // Label at the origin
    ctx.fillText('0', originX - 15, originY + 15);
}


export default GraphCanvas;
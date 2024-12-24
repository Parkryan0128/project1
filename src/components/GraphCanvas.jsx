import React, { useRef, useEffect } from 'react';


function GraphCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);
        const originX = width / 2;
        const originY = height / 2;

        const dpr = window.devicePixelRatio || 1;
        if (dpr !== 1) {
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          ctx.scale(dpr, dpr);
        }

        // Draw X-axis
        ctx.beginPath();
        for (let i = 0; i < 40; i++) {
            ctx.moveTo(0, i * (height / 40));
            ctx.lineTo(width, i * (height / 40));
            ctx.moveTo(i * (width / 40), 0);
            ctx.lineTo(i * (width / 40), height);
        }
        ctx.strokeStyle = '#F0F0F0'; // Grey color for axes
        ctx.lineWidth = 1; // Thickness of the axes
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            ctx.moveTo(i * width / 8, 0);
            ctx.lineTo(i * width / 8, height);
            ctx.moveTo(0, i * height / 8);
            ctx.lineTo(width, i * height / 8);
        }
        ctx.strokeStyle = '#D3D3D3'; // Grey color for axes
        ctx.lineWidth = 1; // Thickness of the axes
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(width, originY);
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, height);
        ctx.strokeStyle = 'black'; // Grey color for axes
        ctx.lineWidth = 2; // Thickness of the axes
        ctx.stroke();

    }, []);

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


// const drawGraph = (canvas) => {
//     const ctx = canvas.getContext('2d');
//     const width = canvas.width;
//     const height = canvas.height;
//     ctx.clearRect(0, 0, width, height);
//     const originX = width / 2;
//     const originY = height / 2;

//     const dpr = window.devicePixelRatio || 1;
//     if (dpr !== 1) {
//       canvas.width = width * dpr;
//       canvas.height = height * dpr;
//       canvas.style.width = `${width}px`;
//       canvas.style.height = `${height}px`;
//       ctx.scale(dpr, dpr);
//     }

//     // Draw X-axis
//     ctx.beginPath();
//     for (let i = 0; i < 40; i++) {
//         ctx.moveTo(0, i * (height / 40));
//         ctx.lineTo(width, i * (height / 40));
//         ctx.moveTo(i * (width / 40), 0);
//         ctx.lineTo(i * (width / 40), height);
//     }
//     ctx.strokeStyle = '#F0F0F0'; // Grey color for axes
//     ctx.lineWidth = 1; // Thickness of the axes
//     ctx.stroke();

//     ctx.beginPath();
//     for (let i = 0; i < 8; i++) {
//         ctx.moveTo(i * width / 8, 0);
//         ctx.lineTo(i * width / 8, height);
//         ctx.moveTo(0, i * height / 8);
//         ctx.lineTo(width, i * height / 8);
//     }
//     ctx.strokeStyle = '#D3D3D3'; // Grey color for axes
//     ctx.lineWidth = 1; // Thickness of the axes
//     ctx.stroke();


//     ctx.beginPath();
//     ctx.moveTo(0, originY);
//     ctx.lineTo(width, originY);
//     ctx.moveTo(originX, 0);
//     ctx.lineTo(originX, height);
//     ctx.strokeStyle = 'black'; // Grey color for axes
//     ctx.lineWidth = 2; // Thickness of the axes
//     ctx.stroke();
// }


export default GraphCanvas;
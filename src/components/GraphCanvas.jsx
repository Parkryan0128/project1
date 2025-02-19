// GraphCanvas.jsx
import React, { useRef, useEffect, useState } from 'react';
import { drawGrid, drawAxis, drawGraph, drawLabel } from '../utils/canvasDraw';
import PlusLogo from '../assets/plus.svg';
import MinusLogo from '../assets/minus.svg';
import HomeLogo from '../assets/home.svg';

// Single function for animated transitions
function animateValue({
    fromScale, toScale,
    fromOrigin, toOrigin,
    duration = 200,
    onFrame
}) {
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);

        const currentScale = fromScale + (toScale - fromScale) * t;
        const currentOrigin = {
            x: fromOrigin.x + (toOrigin.x - fromOrigin.x) * t,
            y: fromOrigin.y + (toOrigin.y - fromOrigin.y) * t
        };

        onFrame(currentScale, currentOrigin);

        if (t < 1) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}

export default function GraphCanvas() {
    const canvasRef = useRef(null);
    const isDragging = useRef(false);
    const [width, setWidth] = useState(1000)
    const [height, setHeight] = useState(1000)

    // Default states
    const defaultScale = 100;
    const defaultOrigin = { x: width / 2, y: height / 2 };
    const [equation, setEquation] = useState('y = Math.sqrt(x)');
    const [origin, setOrigin] = useState({ ...defaultOrigin });
    const [scale, setScale] = useState(defaultScale);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // ---- Zoom Animations ----
    function animateZoom(factor) {
        const targetScale = scale * factor;

        // clamp if you want
        let clampedScale = Math.max(2.0e-9, Math.min(targetScale, 5000000));

        const anchor = { x: width / 2, y: height / 2 };
        const newOrigin = {
            x: anchor.x - factor * (anchor.x - origin.x),
            y: anchor.y - factor * (anchor.y - origin.y)
        };

        animateValue({
            fromScale: scale,
            toScale: clampedScale,
            fromOrigin: origin,
            toOrigin: newOrigin,
            duration: 150,
            onFrame: (cs, co) => {
                setScale(cs);
                setOrigin(co);
            }
        });
    }

    function animateZoomOut() {
        animateZoom(0.5);
    }

    function animateZoomIn() {
        animateZoom(2);
    }

    function animateReset() {
        animateValue({
            fromScale: scale,
            toScale: defaultScale,
            fromOrigin: origin,
            toOrigin: defaultOrigin,
            duration: 150,
            onFrame: (cs, co) => {
                setScale(cs);
                setOrigin(co);
            }
        });
    }

    // ---- Canvas Drawing ----
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear + handle HiDPI
        const dpr = window.devicePixelRatio || 1;
        if (dpr !== 1) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        } else {
            ctx.clearRect(0, 0, width, height);
        }

        drawGrid(ctx, width, height, origin, scale);
        drawAxis(ctx, origin, width, height);
        drawLabel(ctx, origin, width, height, scale);
        drawGraph(ctx, origin, width, scale, equation);
    }, [equation, origin, scale]);

    // ---- Mouse Panning ----
    useEffect(() => {
        const canvas = canvasRef.current;

        function handleMouseDown(e) {
            isDragging.current = true;
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        }
        function handleMouseMove(e) {
            if (!isDragging.current) return;
            const deltaX = e.clientX - lastMousePos.current.x;
            const deltaY = e.clientY - lastMousePos.current.y;
            setOrigin(prev => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY
            }));
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        }
        function handleMouseUp() {
            isDragging.current = false;
        }
        function handleMouseLeave() {
            isDragging.current = false;
        }

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [origin]);

    // ---- Wheel Zoom ----
    useEffect(() => {
        const canvas = canvasRef.current;

        function handleWheel(e) {
            e.preventDefault();
            const zoomIntensity = 0.001;
            const delta = e.deltaY * zoomIntensity;
            let newScale = scale * (1 - delta);

            // clamp
            if (newScale < 2e-9 || newScale > 5e6) return;

            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // If near the origin, anchor on origin
            const THRESHOLD_PX = 75;
            const distX = Math.abs(mouseX - origin.x);
            const distY = Math.abs(mouseY - origin.y);
            let anchorX = mouseX;
            let anchorY = mouseY;
            if (distX < THRESHOLD_PX && distY < THRESHOLD_PX) {
                anchorX = origin.x;
                anchorY = origin.y;
            }

            const zoomFactor = newScale / scale;
            const newOrigin = {
                x: anchorX - zoomFactor * (anchorX - origin.x),
                y: anchorY - zoomFactor * (anchorY - origin.y)
            };
            setScale(newScale);
            setOrigin(newOrigin);
        }

        canvas.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            canvas.removeEventListener('wheel', handleWheel, { passive: false });
        };
    }, [scale, origin]);

    return (
        <div style={{ position: 'relative', width, height }}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ border: '1px solid #ccc', display: 'block' }}
            />

            {/* Zoom In Button */}
            <button
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: width / 25,
                    height: width / 25,
                    zIndex: 999, // ensure it stays above the canvas
                    cursor: 'pointer',
                    backgroundColor: "#E8E8E8",
                    borderColor: "#F0F0F0",
                    borderRadius: "5px"
                }}
                onClick={animateZoomIn}
            >
                <img
                    style={{ width: "100%", height: "100%" }}
                    src={PlusLogo}
                    alt="Zoom In"
                />
            </button>

            {/* Zoom Out Button */}
            <button
                style={{
                    position: 'absolute',
                    top: 10 + width / 25,
                    right: 10,
                    width: width / 25,
                    height: width / 25,
                    cursor: 'pointer',
                    backgroundColor: "#E8E8E8",
                    borderColor: "#F0F0F0",
                    borderRadius: "5px"
                }}
                onClick={animateZoomOut}
            >
                <img
                    style={{ width: "100%", height: "100%" }}
                    src={MinusLogo}
                    alt="Zoom Out"
                />
            </button>

            {/* Reset Button */}
            <button
                style={{
                    position: 'absolute',
                    top: 10 + 2 * (width / 25) + 10,
                    right: 10,
                    width: width / 25,
                    height: width / 25,
                    cursor: 'pointer',
                    backgroundColor: "#E8E8E8",
                    borderColor: "#F0F0F0",
                    borderRadius: "5px"
                }}
                onClick={animateReset}
            >
                <img
                    style={{ width: "100%", height: "100%" }}
                    src={HomeLogo}
                    alt="Reset View"
                />
            </button>
        </div>
    );
}
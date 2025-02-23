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

function computeFunctionY(equation, x) {
    const rhsExpression = equation.split('=')[1].trim();
    const yFunction = new Function('x', `return ${rhsExpression}`);
    try {
        const val = yFunction(x);
        if (!Number.isFinite(val)) return null;
        return val;
    } catch {
        return null;
    }
}

export default function GraphCanvas({equation, graphWidth, graphHeight}) {
    const canvasRef = useRef(null);
    const isDragging = useRef(false);
    // Default states
    const defaultScale = 100;
    const defaultOrigin = { x: graphWidth / 2, y: graphHeight / 2 };
    const [selectedEquation, setSelectedEquation] = useState('');
    const [origin, setOrigin] = useState({ ...defaultOrigin });
    const [scale, setScale] = useState(defaultScale);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const [marker, setMarker] = useState({
        active: false,   // is a marker currently placed?
        x: 0,            // math-space X coordinate
        y: 0             // math-space Y coordinate
    });
    const [isMarkerDragging, setIsMarkerDragging] = useState(false);

    function isMouseNearGraph(equationArray, mx, my, origin, scale, threshold) {
        let minDist = threshold;       // track minimal distance found
        let selectedEq = null;        // track which equation is closest
        const xValue = (mx - origin.x) / scale;

        for (let i = 0; i < equationArray.length; i++) {
            const eq = equationArray[i].expression;
            const rhs = eq.split('=')[1].trim();
            const yFunction = new Function('x', `return ${rhs}`);

            let yVal;
            try {
                yVal = yFunction(xValue);
                if (!Number.isFinite(yVal)) {
                    continue;
                }
            } catch {
                continue;
            }

            // Convert that yVal to canvas Y
            const graphCanvasY = origin.y - yVal * scale;
            // The actual distance from mouse to that curve
            const dist = Math.abs(my - graphCanvasY);

            if (dist < minDist) {
                minDist = dist;
                selectedEq = eq;
            }
        }

        if (selectedEq && minDist <= threshold) {
            return selectedEq
        }

        return null;
    }

    // ---- Zoom Animations ----
    function animateZoom(factor) {
        const targetScale = scale * factor;

        // clamp if you want
        let clampedScale = Math.max(2.0e-9, Math.min(targetScale, 5000000));

        const anchor = { x: graphWidth / 2, y: graphHeight / 2 };
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
        // Handle HiDPI, always clear the canvas:
        const dpr = window.devicePixelRatio || 1;
        canvas.width = graphWidth * dpr;
        canvas.height = graphHeight * dpr;
        canvas.style.width = `${graphWidth}px`;
        canvas.style.height = `${graphHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, graphWidth, graphHeight);

        // Draw your grid, axes, labels, graph, etc.
        drawGrid(ctx, graphWidth, graphHeight, origin, scale);
        drawAxis(ctx, origin, graphWidth, graphHeight);
        drawLabel(ctx, origin, graphWidth, graphHeight, scale);
        drawGraph(ctx, origin, graphWidth, scale, equation);

        // ----- Draw Marker if Active -----
        if (marker.active) {
            const markerCanvasX = origin.x + marker.x * scale;
            const markerCanvasY = origin.y - marker.y * scale;

            // Draw marker circle
            ctx.beginPath();
            ctx.arc(markerCanvasX, markerCanvasY, 4, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();

            // Label text and box
            const labelText = `(${marker.x.toFixed(2)}, ${marker.y.toFixed(4)})`;
            const labelX = markerCanvasX + 8;
            const labelY = markerCanvasY - 8;

            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            const metrics = ctx.measureText(labelText);
            const textWidth = metrics.width;
            const lineHeight = 16;
            const padding = 4;

            // --- Draw shadowed white rectangle ---
            ctx.save();  // save current state, so shadow & fillStyle won't affect later drawings

            // Configure shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            // Draw rectangle behind text
            ctx.fillStyle = 'white';
            ctx.fillRect(
                labelX - padding,
                labelY - padding,
                textWidth + padding * 2,
                lineHeight + padding * 2
            );

            // Turn off the shadow before drawing text
            ctx.shadowColor = 'transparent';

            // Now draw the text on top
            ctx.fillStyle = 'black';
            ctx.fillText(labelText, labelX, labelY);

            ctx.restore(); // restore shadow settings, fill style, etc.
        }
    }, [graphWidth, graphHeight, equation, origin, scale, marker]);

    useEffect(() => {
        const canvas = canvasRef.current;

        function handleMouseDown(e) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const threshold = 10;

            const eq = isMouseNearGraph(equation, mouseX, mouseY, origin, scale, threshold);
            if (eq) {
                // Start marker-drag mode
                setIsMarkerDragging(true);
                setSelectedEquation(eq);
                // Snap the marker to the function at that X
                const xValue = (mouseX - origin.x) / scale;
                const yValue = computeFunctionY(eq, xValue);
                if (yValue != null) {
                    setMarker({
                        active: true,
                        x: xValue,
                        y: yValue
                    });
                }
            } else {
                // Normal panning
                isDragging.current = true;
                lastMousePos.current = { x: e.clientX, y: e.clientY };
            }
        }

        function handleMouseMove(e) {
            if (isDragging.current) {
                // Panning logic
                const deltaX = e.clientX - lastMousePos.current.x;
                const deltaY = e.clientY - lastMousePos.current.y;
                setOrigin(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
                lastMousePos.current = { x: e.clientX, y: e.clientY };
            } else if (isMarkerDragging) {
                // Marker logic
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                // We only need the X for the marker to follow horizontally:
                const xValue = (mouseX - origin.x) / scale;
                const yValue = computeFunctionY(selectedEquation, xValue)
                if (yValue != null) {
                    setMarker({ active: true, x: xValue, y: yValue });
                }
            }
        }

        function handleMouseUp(e) {
            if (isDragging.current) {
                isDragging.current = false;
            }
            if (isMarkerDragging) {
                setIsMarkerDragging(false);
            }
            setMarker({
                active: false,
                x: 0,
                y: 0
            })
        }

        function handleMouseLeave() {
            if (isDragging.current) {
                isDragging.current = false;
            }
            if (isMarkerDragging) {
                setIsMarkerDragging(false);
            }
            setMarker({
                active: false,
                x: 0,
                y: 0
            })
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
    }, [origin, scale, equation, isMarkerDragging]);

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
        <div style={{ position: 'relative', graphWidth, graphHeight }}>
            <canvas
                ref={canvasRef}
                width={graphWidth}
                height={graphHeight}
                style={{ border: '1px solid #ccc', display: 'block' }}
            />

            {/* Zoom In Button */}
            <button
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 40,
                    height: 40,
                    zIndex: 999, // ensure it stays above the canvas
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
                    top: 50,
                    right: 10,
                    width: 40,
                    height: 40,
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
                    top: 100,
                    right: 10,
                    width: 40,
                    height: 40,
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


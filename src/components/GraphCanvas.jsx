import React, { useRef, useEffect, useState } from 'react';
import { drawGrid, drawAxis, drawLabel, drawGraph } from '../utils/canvasDraw';
import PlusLogo from '../assets/plus.svg';
import MinusLogo from '../assets/minus.svg';
import HomeLogo from '../assets/home.svg';

//
// 1) Helper to animate scale/origin transitions
//
function animateValue({ fromScale, toScale, fromOrigin, toOrigin, duration = 200, onFrame }) {
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

//
// 2) Evaluate y for "y = f(x)"
//
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

//
// 3) Precompute an array of (canvasX, canvasY) points along the width
//
function computeGraphPoints(width, origin, scale, equation) {
    const pts = [];
    for (let i = 0; i < width; i++) {
        const xValue = (i - origin.x) / scale;
        const yValue = computeFunctionY(equation, xValue);
        if (yValue == null) {
            pts.push(null); // invalid => break the line
        } else {
            const canvasY = origin.y - yValue * scale;
            pts.push([i, canvasY]);
        }
    }
    return pts;
}

export default function GraphCanvas({ graphWidth, graphEquation }) {
    const canvasRef = useRef(null);
    const isDragging = useRef(false);

    // Canvas size
    const [width, setWidth] = useState(1000);
    const [height, setHeight] = useState(1000);

    // Default states
    const defaultScale = 100;
    const defaultOrigin = { x: width / 2, y: height / 2 };

    // Equation, scale, origin
    const [equation, setEquation] = useState('y = x**3');
    const [scale, setScale] = useState(defaultScale);
    const [origin, setOrigin] = useState({ ...defaultOrigin });

    // For panning
    const lastMousePos = useRef({ x: 0, y: 0 });
    // Marker logic
    const [marker, setMarker] = useState({ active: false, x: 0, y: 0 });
    const [isMarkerDragging, setIsMarkerDragging] = useState(false);

    //
    // 4) Animated drawing states
    //
    const [points, setPoints] = useState([]);     // entire array of [canvasX, canvasY]
    const [drawIndex, setDrawIndex] = useState(0); // how many points are currently drawn

    //
    // 5) Recompute points WITHOUT animation if scale/origin changes.
    //    => We immediately show the full curve.
    //
    useEffect(() => {
        const pts = computeGraphPoints(width, origin, scale, equation);
        setPoints(pts);
        // Show entire curve at once
        setDrawIndex(pts.length);
    }, [scale, origin, width, height]);
    // NOTE: we do NOT include `equation` here, so changing eqn won't trigger this.

    //
    // 6) Recompute points WITH animation if equation changes
    //    => "hand-draw" from left to right quickly
    //
    useEffect(() => {
        const pts = computeGraphPoints(width, origin, scale, equation);
        setPoints(pts);
        setDrawIndex(0);

        // Animate from 0 to pts.length
        let i = 0;
        // We'll skip e.g. 3 points each step to speed it up
        const skip = 3;
        const timerId = setInterval(() => {
            i += skip;
            setDrawIndex(prev => {
                const nextVal = prev + skip;
                if (nextVal >= pts.length) {
                    clearInterval(timerId);
                    return pts.length; // clamp
                }
                return nextVal;
            });
        }, 3); // every 5 ms we move forward skip points => quite fast

        return () => clearInterval(timerId);
    }, [equation, width, height]);
    // NOTE: no origin/scale here => we only animate on eqn changes

    //
    // 7) Main drawing effect:
    //
    useEffect(() => {
        setWidth(graphWidth);
        console.log(width);
    }, [graphWidth]);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear & handle HiDPI
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        // 1) Grid, Axis, Labels
        drawGrid(ctx, width, height, origin, scale);
        drawAxis(ctx, origin, width, height);
        drawLabel(ctx, origin, width, height, scale);
      
        // Draw all graphs using the equations array
        graphEquation.forEach((eq) => {
            drawGraph(ctx, origin, width, scale, eq);
        });
    }, [graphEquation, origin, scale, width]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // 2) Partial Graph from 0..drawIndex
        ctx.beginPath();
        let first = true;
        for (let i = 0; i < drawIndex; i++) {
            const pt = points[i];
            if (!pt) {
                // invalid => break the stroke
                first = true;
                continue;
            }
            const [cx, cy] = pt;
            if (first) {
                ctx.moveTo(cx, cy);
                first = false;
            } else {
                ctx.lineTo(cx, cy);
            }
        }
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3) Marker
        if (marker.active) {
            const markerCanvasX = origin.x + marker.x * scale;
            const markerCanvasY = origin.y - marker.y * scale;

            ctx.beginPath();
            ctx.arc(markerCanvasX, markerCanvasY, 4, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();

            const labelText = `(${marker.x.toFixed(2)}, ${marker.y.toFixed(6)})`;
            const labelX = markerCanvasX + 8;
            const labelY = markerCanvasY - 8;

            ctx.font = '14px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            const metrics = ctx.measureText(labelText);
            const textWidth = metrics.width;
            const lineHeight = 16;
            const padding = 4;

            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            ctx.fillStyle = 'white';
            ctx.fillRect(labelX - padding, labelY - padding, textWidth + padding * 2, lineHeight + padding * 2);

            ctx.shadowColor = 'transparent';
            ctx.fillStyle = 'black';
            ctx.fillText(labelText, labelX, labelY);
            ctx.restore();
        }
    }, [width, height, points, drawIndex, origin, scale, marker]);

    //
    // 8) Mouse events: Panning + Marker
    //
    function isMouseNearGraph(equation, mx, my, origin, scale, threshold) {
        const xVal = (mx - origin.x) / scale;
        const yVal = computeFunctionY(equation, xVal);
        if (yVal == null) return false;
        const graphCanvasY = origin.y - yVal * scale;
        const dist = Math.abs(my - graphCanvasY);
        return dist <= threshold;
    }

    useEffect(() => {
        const canvas = canvasRef.current;

        function handleMouseDown(e) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            if (isMouseNearGraph(equation, mouseX, mouseY, origin, scale, 20)) {
                setIsMarkerDragging(true);
                const xVal = (mouseX - origin.x) / scale;
                const yVal = computeFunctionY(equation, xVal);
                if (yVal != null) {
                    setMarker({ active: true, x: xVal, y: yVal });
                }
            } else {
                // Pan
                isDragging.current = true;
                lastMousePos.current = { x: e.clientX, y: e.clientY };
            }
        }

        function handleMouseMove(e) {
            if (isDragging.current) {
                const deltaX = e.clientX - lastMousePos.current.x;
                const deltaY = e.clientY - lastMousePos.current.y;
                setOrigin(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
                lastMousePos.current = { x: e.clientX, y: e.clientY };
            } else if (isMarkerDragging) {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const xVal = (mouseX - origin.x) / scale;
                const yVal = computeFunctionY(equation, xVal);
                if (yVal != null) {
                    setMarker({ active: true, x: xVal, y: yVal });
                }
            }
        }

        function handleMouseUp() {
            if (isDragging.current) {
                isDragging.current = false;
            }
            if (isMarkerDragging) {
                setIsMarkerDragging(false);
            }
            // if you want marker to disappear:
            setMarker({ active: false, x: 0, y: 0 });
        }

        function handleMouseLeave() {
            if (isDragging.current) {
                isDragging.current = false;
            }
            if (isMarkerDragging) {
                setIsMarkerDragging(false);
            }
            // setMarker({ active: false, x: 0, y: 0 });
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

    //
    // 9) Wheel zoom
    //
    useEffect(() => {
        const canvas = canvasRef.current;
        function handleWheel(e) {
            e.preventDefault();
            const zoomIntensity = 0.001;
            const delta = e.deltaY * zoomIntensity;
            let newScale = scale * (1 - delta);

            if (newScale < 2e-9 || newScale > 5e6) return;
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const THRESHOLD_PX = 75;
            const distX = Math.abs(mouseX - origin.x);
            const distY = Math.abs(mouseY - origin.y);
            let anchorX = mouseX, anchorY = mouseY;
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

    //
    // 10) Zoom In/Out/Reset Buttons
    //
    function animateZoom(factor) {
        const targetScale = scale * factor;
        const clampedScale = Math.max(2e-9, Math.min(targetScale, 5e6));

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

    return (
        <div style={{ position: 'relative', width, height }}>
            <canvas
                ref={canvasRef}
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
                    cursor: 'pointer',
                    backgroundColor: "#E8E8E8",
                    borderColor: "#F0F0F0",
                    borderRadius: "5px"
                }}
                onClick={animateZoomIn}
            >
                <img style={{ width: "100%", height: "100%" }} src={PlusLogo} alt="Zoom In" />
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
                <img style={{ width: "100%", height: "100%" }} src={MinusLogo} alt="Zoom Out" />
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
                <img style={{ width: "100%", height: "100%" }} src={HomeLogo} alt="Reset View" />
            </button>
        </div>
    );
}

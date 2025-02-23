// utils/canvasDraw.js
import { formatNumber, getGridSteps } from './canvasUtil';

export function drawTextWithBackground(ctx, text, x, y, boxAlign = 'center') {
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const fontMatch = ctx.font.match(/(\d+)px/);
    const lineHeight = fontMatch ? parseInt(fontMatch[1], 10) : 12;
    const padding = 5;

    let boxX = x, boxY = y;
    let boxWidth = textWidth + padding * 2;
    let boxHeight = lineHeight + padding * 2;

    ctx.save();
    ctx.fillStyle = 'white';

    if (boxAlign === 'center') {
        // e.g. X-axis label, textAlign='center', textBaseline='top'
        boxX -= textWidth / 2 + padding;
        boxY -= padding;
    } else if (boxAlign === 'right') {
        // e.g. Y-axis label
        boxX -= textWidth + padding;
        boxY -= padding;
    }
    // ... you can add more alignment logic as needed

    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y);
    ctx.restore();
}

// Draw the background grid lines
export function drawGrid(ctx, width, height, origin, scale) {
    const { majorStep, minorStep } = getGridSteps(scale);
    const majorGridSpacing = majorStep * scale;
    const minorGridSpacing = minorStep * scale;

    // Minor lines
    ctx.strokeStyle = '#DCDCDC';
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    // vertical minor
    for (let x = origin.x % minorGridSpacing; x <= width; x += minorGridSpacing) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
    }
    for (let x = origin.x % minorGridSpacing; x >= 0; x -= minorGridSpacing) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
    }

    // horizontal minor
    for (let y = origin.y % minorGridSpacing; y <= height; y += minorGridSpacing) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
    }
    for (let y = origin.y % minorGridSpacing; y >= 0; y -= minorGridSpacing) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
    }

    ctx.stroke();

    // Major lines
    ctx.strokeStyle = '#808080';
    ctx.beginPath();

    // vertical major
    for (let x = origin.x % majorGridSpacing; x <= width; x += majorGridSpacing) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
    }
    for (let x = origin.x % majorGridSpacing; x >= 0; x -= majorGridSpacing) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
    }

    // horizontal major
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

// Axes
export function drawAxis(ctx, origin, width, height) {
    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(width, origin.y);
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Graph function y = f(x)
export function drawGraph(ctx, origin, width, scale, equation) {
    for (let j=0; j < equation.length; j ++) {
        const rhsExpression = (equation[j].expression).split('=')[1].trim();
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
}

// Axis labels
export function drawLabel(ctx, origin, width, height, scale) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';

    // X-axis
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const { majorStep } = getGridSteps(scale);
    const xOffset = 6;
    const yOffset = 6;
    const EPSILON = 1e-5;

    // Range for X
    const xStartUnit = Math.ceil((-origin.x) / scale / majorStep) * majorStep;
    const xEndUnit = Math.floor((width - origin.x) / scale / majorStep) * majorStep;

    for (let x = xStartUnit; x <= xEndUnit; x += majorStep) {
        if (Math.abs(x) < EPSILON) continue;
        const canvasX = origin.x + x * scale;
        const canvasY = origin.y + yOffset;
        const label = formatNumber(x);

        // background behind label
        drawTextWithBackground(ctx, label, canvasX, canvasY, 'center');
    }

    // Y-axis
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const yStartUnit = Math.ceil((-origin.y) / scale / majorStep) * majorStep;
    const yEndUnit = Math.floor((height - origin.y) / scale / majorStep) * majorStep;

    for (let y = yStartUnit; y <= yEndUnit; y += majorStep) {
        if (Math.abs(y) < EPSILON) continue;
        const canvasY = origin.y + y * scale;
        const canvasX = origin.x - xOffset;
        const label = formatNumber(-y); // if you want upward as +y

        drawTextWithBackground(ctx, label, canvasX, canvasY, 'right');
    }

    // Origin label
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('0', origin.x - xOffset, origin.y + yOffset);

    ctx.restore();
}

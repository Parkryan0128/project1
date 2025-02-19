export const superScriptMap = {
    '-': '⁻',
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹'
};

export function toSuperscript(str) {
    return str
        .split('')
        .map(ch => superScriptMap[ch] || ch)
        .join('');
}

export function roundToDecimals(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round((num + Number.EPSILON) * factor) / factor;
}

export function getNiceNumber(value) {
    if (value === 0) return 0;
    const exponent = Math.floor(Math.log10(value));
    const fraction = value / Math.pow(10, exponent);

    let niceFraction;
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;

    const niceNumber = niceFraction * Math.pow(10, exponent);
    return roundToDecimals(niceNumber, 10);
}

export function formatNumber(num) {
    if (!Number.isFinite(num)) {
        return String(num); // "Infinity", "NaN", etc.
    }

    const absVal = Math.abs(num);
    // Thresholds for scientific notation
    const LARGE_THRESHOLD = 1e5;
    const SMALL_THRESHOLD = 1e-4;

    // Special case: near zero
    if (absVal < Number.EPSILON) {
        return '0';
    }

    // Decide when to use scientific notation
    if (absVal >= LARGE_THRESHOLD || absVal < SMALL_THRESHOLD) {
        // e.g. "2.0e+2"
        let sciStr = num.toExponential(1);
        // e.g. "-2.0e+2" or "2.0e-6"
        let [mantissa, exponentStr] = sciStr.split('e');

        let sign = '';
        if (mantissa.startsWith('-')) {
            sign = '-';
            mantissa = mantissa.slice(1);
        }

        let exponent = parseInt(exponentStr, 10);
        const exponentSup = toSuperscript(String(exponent));

        // Remove trailing ".0" if decimal portion is zero
        mantissa = parseFloat(mantissa).toString();

        // Build final string: e.g. "-2×10²"
        return `${sign}${mantissa}×10${exponentSup}`;
    } else {
        // For normal range
        return String(roundToDecimals(num, 5));
    }
}


export function getGridSteps(scale) {
    const desiredMajorPixelSpacing = 100;
    const desiredMinorPixelSpacing = 20;

    const approximateMajorStep = desiredMajorPixelSpacing / scale;
    const approximateMinorStep = desiredMinorPixelSpacing / scale;

    const majorStep = getNiceNumber(approximateMajorStep);
    const minorStep = getNiceNumber(approximateMinorStep);

    return { majorStep, minorStep };
}
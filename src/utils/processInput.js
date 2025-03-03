const int_ending = "_INT";
const fraction_ending = "_FRACTION";
const log_ending = "_LOG";

const CURSOR = 'cursor';

// Exponent constants
const EXPONENT_OPEN = "_EXPONENT_OPEN_";
const EXPONENT_CLOSE = "_EXPONENT_CLOSE_";
const EMPTY_EXPONENT = '_EMPTY__EXPONENT_';

// Fraction constants

const FRACTION_OPEN = '_FRACTION_OPEN_';
const FRACTION_CLOSE = '_FRACTION_CLOSE_';

// Integral constants

const UPPER_OPEN = '_INT_UPPER_BRACKET_OPEN_';
const UPPER_CLOSE = '_INT_UPPER_BRACKET_CLOSE_';
const LOWER_OPEN = '_INT_LOWER_BRACKET_OPEN_';
const LOWER_CLOSE = '_INT_LOWER_BRACKET_CLOSE_';
const VALUE_OPEN = '_INT_VALUE_BRACKET_OPEN_';
const VALUE_CLOSE = '_INT_VALUE_BRACKET_CLOSE_';

// Log constants

const LOG_OPEN = '_LOG_OPEN_';
const LOG_CLOSE = '_LOG_CLOSE_';

// Square root constants
const SQUARE_ROOT_OPEN = "_SQUARE_ROOT_OPEN_";
const SQUARE_ROOT_CLOSE = "_SQUARE_ROOT_CLOSE_";
const EMPTY_SQUARE_ROOT = '_EMPTY_SQUARE_ROOT_'



export function processInput(inputArr) {
    const result = [];
    let i = 0;

    const int_pairs = findParenPairs(inputArr, int_ending)
    const frac_pairs = findParenPairs(inputArr, fraction_ending)
    const log_pairs = findParenPairs(inputArr, log_ending)


    while (i < inputArr.length) {
        
        const token = inputArr[i];

        if (token === CURSOR) {
            result.push({
                type: 'cursor',
            });
            i++;
        }

        else if (token === FRACTION_OPEN) {
            let [temp, i_temp] = processFraction(inputArr, frac_pairs, i); // need import from fraction
            result.push(temp);
            i = i_temp;
        }

        else if (token === EMPTY_EXPONENT) {
            result.push({type: 'empty_exponent'})
            i++
        } else if (token === '^') {
            let base = processInput(findBase([...inputArr].slice(0, i)))             // need import from exponent
            let children_0 = processInput(findChildren([...inputArr].slice(i + 1)))


            result.splice(result.length - base.length, base.length)

            result.push({
                type: 'exponent',
                value: base,
                children: children_0
            })

            i += findChildren([...inputArr].slice(i + 1)).length;     // nned import from exponent
            // console.log(base)
            // console.log(children_0)
        }

        else if (token == EMPTY_SQUARE_ROOT) {
            result.push({type : 'empty_square_root'})
            i++
        } else if (token === '√') {
            let closeIndex = findMatchingSquareRootClose(inputArr, i + 1)    // need import from square root
            let jumpIndex = closeIndex - i;

            let radicand = processInput(findRadicand([...inputArr].slice(i + 1)))   // need import from square root

            result.push({
                type: 'square-root',
                value: radicand
            })

            i = i + jumpIndex + 1;
        }

        else if (/^[a-zA-Z0-9+\-*()=]+$/i.test(token)) {

            if (token === 'i' && inputArr[i+1] === 'n' && inputArr[i+2] === 't') {
                let [temp, i_temp] = processIntegral(inputArr, int_pairs, i);       // integral
                result.push(temp);
                i = i_temp;
            }

            else if (token === LOG_OPEN) {
                let [temp, i_temp] = processLogarithm(inputArr, log_pairs, i);  // logarithm
                result.push(temp);
                i = i_temp;
            }

            else {
                result.push({
                    type: 'text',
                    value: token
                });
                i++;
            }
        }

        else {
            i++;
        }
    }

    return result;
}
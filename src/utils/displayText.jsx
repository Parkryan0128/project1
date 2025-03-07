    export function displayText(nodeList) {
        return nodeList.map((node, index) => {
            switch (node.type) {
                case 'text':
                    return (<span key={index}>{node.value}</span>);
                
                case 'exponent':
                    return (
                        <span key={index}>
                            <span>{displayText(node.value)}</span>
                            <sup>
                                <span>{displayText(node.children)}</span>
                            </sup>
                        </span>
                    );

                case 'empty_space':
                    return (<span key={index} className="empty-space"/>)

                case 'square-root':
                    return (
                        <span key={index} className = "square-root">
                        <span>√</span>
                        <span>(</span>
                        <span className='radicand'>{displayText(node.value)}</span>
                        <span>)</span>
                    </span>
                    )

                case 'empty_square_root':
                    return (
                        <span key={index} className="empty-square-root"/>
                    );

                case 'fraction':
                    return (<span className="fraction" key={index}>
                        <span className="numerator">{displayText(node.numerator)}</span>
                        <span className="fraction-bar" />
                        <span className="denominator">{displayText(node.denominator)}</span>
                    </span>
                    );
                
                case 'integral':
                    return (<span className='integral' key={index}>
                        <span className='integral-sign'><big>∫</big></span>
                        <span className='bounds-group'>
                            <span className='upper-bound'>{displayText(node.upperBound)}</span>
                            <span className='lower-bound'>{displayText(node.lowerBound)}</span>
                        </span>
                        <span className='value-group'>
                            <span className='integral-value'>{displayText(node.value)}</span>
                            <span className='dx'>dx</span>
                        </span>
                    </span>);

                case 'log':
                    return (<span className="log" key={index}>
                        <span className="log-content">{displayText(node.value)}</span>
                    </span>
                    );

                case 'cursor':
                    return (<span key={index} className="blink-cursor">
                        |
                    </span>
                    );

                default:
                    return null;
            }
        });
    }
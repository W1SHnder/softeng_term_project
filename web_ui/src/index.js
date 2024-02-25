import React from 'react';
import ReactDOM from 'react-dom';

export class HelloWorld extends React.Component {
    render() {
	return (
	    <div>
		<h1>Hello, World!</h1>
	    </div>
	);
    }
}

ReactDOM.render(
    <HelloWorld />,
    document.getElementById('root')
);

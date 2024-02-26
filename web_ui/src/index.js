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

function fetchMovies() {
    return fetch('/api/movies')
	.then(response => response.json());
}

/*
export class MovieList extends React.Component {
    constructor(props) {
	super(props);
	this.state = { movies: [] };
    }
}
*/

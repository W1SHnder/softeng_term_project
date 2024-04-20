import React, { useState } from 'react';

function AddMovieForm({ addMovie }) {
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState('');
    const [mpaaRating, setMPAARating] = useState('');
    const [image, setImage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!title || !rating || !mpaaRating || !image) return;

        addMovie({ title, rating, mpaaRating, image });
        
        setTitle('');
        setRating('');
        setMPAARating('');
        setImage('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder='Movie'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder='Rating'
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder='mpaaRating'
                value={mpaaRating}
                onChange={(e) => setMPAARating(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder='ImageUrl'
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />
            <br />
            <button type="submit">Add Movie</button>
        </form>
    );
}

function MovieList({ movies, removeMovie }) {
    return (
        <ul>
            {movies.map((movie, index) => (
                <li key={index}>
                    Title: {movie.title} | Rating: {movie.rating} | MpaaRating: {movie.mpaaRating} | Image: {movie.image}
                    <button onClick={() => removeMovie(index)}>Remove</button>
                </li>
            ))}
        </ul>
    );
}

function Movies() {
    const [movies, setMovies] = useState([]);

    const removeMovie = (index) => {
        const updatedMovies = movies.filter((_, i) => i !== index);
        setMovies(updatedMovies);
    };

    const addMovie = (movie) => {
        setMovies([...movies, movie]);
    };

    return (
        <div className="Movies">
            <div>
                <h1>Manage Movies</h1>
                <AddMovieForm addMovie={addMovie} />
                <h2>Movies</h2>
                <MovieList movies={movies} removeMovie={removeMovie} />
            </div>
        </div>
    );
}

export default Movies;
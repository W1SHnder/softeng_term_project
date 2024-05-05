import React, { useState } from 'react';
import './styles/Movies.css';
function AddMovieForm({ addMovie }) {
    const [id, setID] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [cast, setCast] = useState('');
    const [director, setDirector] = useState('');
    const [producer, setProducer] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [trailer_picture, setTrailerPicture] = useState('');
    const [trailer_video, setTrailerVideo] = useState('');
    const [mpaa_rating, setMPAARating] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!id || !title || !category || !cast || !director || !producer || !synopsis || !trailer_picture || !trailer_video || !mpaa_rating) return;

        addMovie({ id, title, category, cast, director, producer, synopsis, trailer_picture, trailer_video, mpaa_rating });
        
        setID('');
        setTitle('');
        setCategory('');
        setCast('');
        setDirector('');
        setProducer('');
        setSynopsis('');
        setTrailerPicture('');
        setTrailerVideo('');
        setMPAARating('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder='id'
                value={id}
                onChange={(e) => setID(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder='category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder='cast'
                value={cast}
                onChange={(e) => setCast(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder='director'
                value={director}
                onChange={(e) => setDirector(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder='producer'
                value={producer}
                onChange={(e) => setProducer(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder='synopsis'
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
            />
            <br />
            <label for="file">Trailer Picture</label>
            <input
                type="file"
                name="file"
                placeholder='trailer picture'
                value={trailer_picture}
                onChange={(e) => setTrailerPicture(e.target.value)}
            />
            <br />
            <label for="file">Trailer Video</label>
            <input
                type="file"
                placeholder='trailer video'
                value={trailer_video}
                onChange={(e) => setTrailerVideo(e.target.value)}
            />
            <br />
            <input
                type="text"
                placeholder='MPAA Rating'
                value={mpaa_rating}
                onChange={(e) => setMPAARating(e.target.value)}
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
            <div className='movie-form'>
                <h1>Manage Movies</h1>
                <AddMovieForm addMovie={addMovie} />
                <h2>Movies</h2>
                <MovieList movies={movies} removeMovie={removeMovie} />
            </div>
        </div>
    );
}

export default Movies;
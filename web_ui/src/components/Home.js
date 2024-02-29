import React from 'react';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

const Movie = ({ title, rating, mpaaRating, imageUrl, onClick }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <img src={imageUrl} alt={title} style={{ width: '200px', height: '300px', cursor: 'pointer' }} onClick={onClick} />
      <div style={{ marginTop: '10px' }}>
        <img src={`mpaa-${mpaaRating}.png`} alt={mpaaRating} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
        <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
          <h3>{title}</h3>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movie data from the API endpoint
    fetch('http://localhost:5000/ComingSoon')
      .then(response => response.json())
      .then(data => setMovies(data))
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gridGap: '20px' }}>
      {movies.map(movie => (
        <Movie
          key={movie.id}
          title={movie.title}
          mpaaRating={movie.mpaa_rating}
          imageUrl={movie.trailer_picture}
          onClick={() => console.log(`Clicked on ${movie.title}`)} // Example click handler
        />
      ))}
    </div>
  );
};

export default Home;

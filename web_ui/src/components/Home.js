import React from 'react';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

import './styles/Home.css';

/*
import './assets/images/mpaa_G.png';
import './assets/images/mpaa_PG.png';
import './assets/images/mpaa_PG-13.png';
import './assets/images/mpaa_R.png';
import './assets/images/mpaa_NC-17.png';
*/

const Movie = ({ title, rating, mpaaRating, imageUrl, onClick }) => {
  return (
    <div className="movie">
      <img src={imageUrl} alt={title} className="movie-image" onClick={onClick} />
      <div className="movie-details">
     	  <h3>{mpaaRating}</h3>
          <h3 className="movie-title">{title}</h3>
      </div>
    </div>
  );
};

const GridView = ({ endpoint }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movie data from the API endpoint
    console.log(`Fetching movies from ${endpoint}`);
    fetch(`http://localhost:5000/${endpoint}`)
      .then(response => response.json())
      .then(data => setMovies(data))
      .catch(error => console.error('Error fetching movies:', error));
  }, [endpoint]);

  return (
   <div className="movie-grid">
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

const Home = () => {
    const [endpoint, setEndpoint] = useState('NowShowing');
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleSearch = (search_term) => {
	console.log(`Search for ${search_term}`);
	setEndpoint(`movies?title=${encodeURIComponent(search_term)}`);
	
    };
    console.log("Home component re-rendered. Endpoint:", endpoint); 
    return (
	<div className="home">
	    <div className="home-navbar">
	        <button className={endpoint === 'NowShowing' ? 'active' : ''} onClick={() => setEndpoint('NowShowing')}>Now Playing</button>
                <button className={endpoint === 'ComingSoon' ? 'active' : ''} onClick={() => setEndpoint('ComingSoon')}>Coming Soon</button>
                <div className="search-bar">
          	    <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
	            <button onClick={ () => handleSearch(searchTerm)}>Search</button>
                </div>
	    </div>
	    <GridView endpoint={endpoint} />
	</div>
    );
}
	

export default Home;

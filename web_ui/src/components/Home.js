import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';
import "react-datepicker/dist/react-datepicker.css";
axios.defaults.withCredentials = true;

/*
import './assets/images/mpaa_G.png';
import './assets/images/mpaa_PG.png';
import './assets/images/mpaa_PG-13.png';
import './assets/images/mpaa_R.png';
import './assets/images/mpaa_NC-17.png';
*/

const RedirectButton = ({ to, children }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button onClick={() => handleClick}>{children}</button>
  );
};

function createTimeList(movie) {
  if (!movie || !movie.showtimes) {
    return [];
  }

  const timeList = [];

  movie.showtimes.forEach(showtime => {
    // Extract the time from the SQL datetime string and convert it to 12-hour format
    const time = new Date(showtime.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    // Extract the date in a separate variable
    const date = new Date(showtime.time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    timeList.push(time);
  });

  return timeList;
}



const Movie = ({ title, rating, mpaaRating, imageUrl, date, times, onClick }) => {
  return (
    <div className="movie">
      <img src={imageUrl} alt={title} className="movie-image" onClick={onClick} />
      <div className="movie-details">
        <h3>{mpaaRating}</h3>
        <h3 className="movie-title">{title}</h3>
      </div>
      <div className="show-details">
        {date && <h3>Date: {date}</h3>}
        {times && times.length > 0 && <h3>Show Times:</h3>}
        {times && times.length > 0 && (
          <ul>
            {times.map((time, index) => (
              <li key={index}>{time}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};


const GridView = ({ endpoint, displayMode }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movie data from the API endpoint
    console.log(`Fetching movies from ${endpoint}, Display Mode: ${displayMode}`);
    axios.get('http://127.0.0.1:8000/' + endpoint)
      .then(response => setMovies(response.data))
      .catch(error => console.error('Error fetching movies:', error));
    console.log(movies);
    /*
    fetch(`http://127.0.0.1:8000/${endpoint}`)
      .then(response => response.json())
      .then(data => setMovies(data))
      .catch(error => console.error('Error fetching movies:', error));
    */
  }, [endpoint]);
  //console.log("GridView component re-rendered. Endpoint:", endpoint, "Display Mode:", displayMode);
  switch (displayMode) {
    case 0:
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

    case 1:
      return (
        <div className="movie-grid">
          {movies.map(movie => (
            <Movie
              key={movie.id}
              title={movie.title}
              date={new Date(movie.showtime.time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              mpaaRating={movie.mpaa_rating}
              imageUrl={movie.trailer_picture}
              onClick={() => console.log('Clicked on', movie.title)} // Example click handler
            />
          ))}
        </div>
      );
    case 2:
      const date = new Date(movies[0].showtime.time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return (
        <div className="movie-grid">
          {movies.map(movie => (
            <Movie
              key={movie.id}
              title={movie.title}
              date={date}
              times={createTimeList(movie)}
              mpaaRating={movie.mpaa_rating}
              imageUrl={movie.trailer_picture}
              onClick={() => console.log('Clicked on', movie.title)} // Example click handler
            />
          ))}
        </div>
      );
  }
};

const Home = () => {
  const [endpoint, setEndpoint] = useState('NowPlaying/');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('None');
  const [queryDate, setQueryDate] = useState('');
  const [displayMode, setDisplayMode] = useState(false);

  const categories = ['None', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'];
  const navigateHome = (endpoint_name) => {
    setEndpoint(endpoint_name);
    setDisplayMode(0);
  };
  const handleSearch = (search_term) => {
    console.log(`Search for ${search_term}`);
    setEndpoint(`Movies/?title=${encodeURIComponent(search_term)}`);
    setDisplayMode(1);

    if (category !== 'None') {
      setEndpoint(endpoint + '&category=' + category)
    }
    if (queryDate !== '') {
      const formattedDate = format(queryDate, 'yyyy-MM-dd');
      setEndpoint(endpoint + '&date=' + formattedDate);
      setDisplayMode(2);
    }
    setQueryDate('');
  };

  console.log("Home component re-rendered. Endpoint:", endpoint);
  return (
    <div className="home">
      <div className="home-navbar">
        <button className={endpoint === 'NowPlaying/' ? 'active' : ''} onClick={() => navigateHome('NowPlaying/')}>Now Playing</button>
        <button className={endpoint === 'ComingSoon/' ? 'active' : ''} onClick={() => navigateHome('ComingSoon/')}>Coming Soon</button>
        <div className="search-bar">
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <DatePicker selected={queryDate} onChange={date => setQueryDate(date)} />
          <button onClick={() => handleSearch(searchTerm)}>Search</button>
        </div>
        <div className="utils-bar">
          <RedirectButton to='/Login'>Login</RedirectButton>
        </div>
      </div>
      <GridView endpoint={endpoint} displayMode={displayMode} />
    </div>
  );
};


export default Home;

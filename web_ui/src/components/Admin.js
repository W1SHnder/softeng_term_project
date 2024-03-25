import React, { useState } from 'react';

import './styles/Admin.css';

function AddUserForm({ addUser }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!username || !email) return;

        addUser({ username, email });

        setUsername('');
        setEmail('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
                type="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <button type="submit">Add User</button>
        </form>
    );
}

function UserList({ users, removeUser, suspendUser, updateUser }) {
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [editIndex, setEditIndex] = useState(null);

    const handleUpdate = (index) => {
        setEditIndex(index);
        setUpdatedUsername(users[index].username);
        setUpdatedEmail(users[index].email);
    };

    const handleSave = (index) => {
        updateUser(index, { username: updatedUsername, email: updatedEmail });
        setEditIndex(null);
    };

    const handleCancel = () => {
        setEditIndex(null);
    };

    return (
        <ul>
            {users.map((user, index) => (
                <li key={index}>
                    {editIndex === index ? (
                        <>
                            <input
                                type="text"
                                placeholder="Username"
                                value={updatedUsername}
                                onChange={(e) => setUpdatedUsername(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={updatedEmail}
                                onChange={(e) => setUpdatedEmail(e.target.value)}
                            />
                            <button onClick={() => handleSave(index)}>Save</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </>
                    ) : (
                        <>
                            Username: {user.username} | Email: {user.email}
                            <button onClick={() => removeUser(index)}>Remove</button>
                            <button onClick={() => suspendUser(index)}>
                                {user.suspended ? 'Unsuspend' : 'Suspend'}
                            </button>
                            <button onClick={() => handleUpdate(index)}>Update</button>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
}

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

function App() {
    const [users, setUsers] = useState([]);
    const [movies, setMovies] = useState([]);

    const addUser = (user) => {
        setUsers([...users, user]);
    };

    const removeUser = (index) => {
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
    };

    const suspendUser = (index) => {
        const updatedUsers = [...users];
        updatedUsers[index].suspended = !updatedUsers[index].suspended;
        setUsers(updatedUsers);
    };

    const updateUser = (index, newData) => {
        const updatedUsers = [...users];
        updatedUsers[index] = { ...updatedUsers[index], ...newData };
        setUsers(updatedUsers);
    };

    const removeMovie = (index) => {
        const updatedMovies = movies.filter((_, i) => i !== index);
        setMovies(updatedMovies);
    };

    const addMovie = (movie) => {
        setMovies([...movies, movie]);
    };

    return (
        <><div>
            <h1>Manage Users</h1>
            <AddUserForm addUser={addUser} />
            <h2>Users</h2>
            <UserList users={users} removeUser={removeUser} suspendUser={suspendUser} updateUser={updateUser}/>
        </div><div>
                <h1>Manage Movies</h1>
                <AddMovieForm addMovie={addMovie} />
                <h2>Movies</h2>
                <MovieList movies={movies} removeMovie={removeMovie} />
            </div></>
    );
}

export default App;

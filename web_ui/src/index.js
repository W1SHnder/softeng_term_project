import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import Home from './components/Home';


/*
ReactDOM.render(
    <Routes>
      <Route path="/" exact component={Home} />
    </Routes>
  document.getElementById('root')
);
*/

const router = createBrowserRouter([
    {
	path: '/',
	element: <Home />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
	    <RouterProvider router={router}/>
	</React.StrictMode>
);

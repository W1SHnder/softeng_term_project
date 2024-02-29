import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route,  } from 'react-router-dom';
import Home from './components/Home';

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/" exact component={Home} />
        </Switch>
    </Router>,
  document.getElementById('root')
);




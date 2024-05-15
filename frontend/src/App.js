import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';
import MealDetail from './components/MealDetail';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/change-password" component={ChangePassword} />
        <Route path="/meals/:id" component={MealDetail} />
      </Switch>
    </Router>
  );
}

export default App;

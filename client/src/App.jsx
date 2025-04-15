import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoalProvider } from './context/GoalContext';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import HomePage from './pages/HomePage';
import GoalsPage from './pages/GoalsPage';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './components/Dashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

const App = () => {
    return (
        <AuthProvider>
            <GoalProvider>
                <Router>
                    <Header />
                    <Navigation />
                    <Switch>
                        <Route path="/" exact component={HomePage} />
                        <Route path="/goals" component={GoalsPage} />
                        <Route path="/profile" component={ProfilePage} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/dashboard" component={Dashboard} />
                    </Switch>
                </Router>
            </GoalProvider>
        </AuthProvider>
    );
};

export default App;
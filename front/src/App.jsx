import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Streamers from './pages/Streamers';
import Account from './pages/Account';
import {ROUTES} from './utils/constants';
import './App.css'
import Auth from "./pages/Auth.jsx";
import SignIn from "./components/Register/SignIn.jsx";
import SignUp from "./components/Register/SignUp.jsx";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path={ROUTES.HOME} element={<Home/>}/>
                    <Route path={ROUTES.STREAMERS} element={<Streamers/>}/>
                    <Route path={ROUTES.ACCOUNT} element={<Account/>}/>
                    <Route path={ROUTES.SIGNIN} element={<SignIn/>}/>
                    <Route path={ROUTES.SIGNUP} element={<SignUp/>}/>
                    <Route path={ROUTES.AUTH} element={<Auth/>}/>
                </Routes>
            </Layout>
        </Router>
    );
}

export default App

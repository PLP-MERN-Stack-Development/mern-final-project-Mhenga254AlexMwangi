import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import Profile from './pages/Profile';
import UserSettings from './pages/UserSettings';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/create" element={<CreateRecipe />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/settings" element={<UserSettings />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

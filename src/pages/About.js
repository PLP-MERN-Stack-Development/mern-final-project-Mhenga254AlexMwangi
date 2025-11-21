import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-content">
          <h1>About QuickBite</h1>
          
          <div className="about-section">
            <p>
              Welcome to <strong>QuickBite</strong> - your ultimate destination for discovering, 
              sharing, and creating amazing recipes! We believe that great food brings 
              people together, and we're passionate about making cooking accessible 
              to everyone.
            </p>
          </div>

          <div className="features-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', margin: '3rem 0'}}>
            <div className="feature-card" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '2rem', borderRadius: '15px', color: 'white', textAlign: 'center'}}>
              <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>🍳 Share Recipes</h3>
              <p>Share your culinary creations with the world and inspire other food lovers.</p>
            </div>
            
            <div className="feature-card" style={{background: 'linear-gradient(135deg, #f093fb, #f5576c)', padding: '2rem', borderRadius: '15px', color: 'white', textAlign: 'center'}}>
              <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>👥 Connect</h3>
              <p>Connect with other food enthusiasts and share cooking tips and experiences.</p>
            </div>
            
            <div className="feature-card" style={{background: 'linear-gradient(135deg, #4facfe, #00f2fe)', padding: '2rem', borderRadius: '15px', color: 'white', textAlign: 'center'}}>
              <h3 style={{fontSize: '1.5rem', marginBottom: '1rem'}}>📸 Visual Recipes</h3>
              <p>Upload photos of your cooking process and final delicious results.</p>
            </div>
          </div>

          <div className="mission-section" style={{margin: '3rem 0', padding: '2rem', background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)', borderRadius: '15px'}}>
            <h2 style={{color: '#333', marginBottom: '1rem'}}>Our Mission</h2>
            <p style={{fontSize: '1.1rem', lineHeight: '1.7', color: '#555'}}>
              To create a vibrant community where food lovers can share their passion, 
              learn from each other, and discover new recipes that bring joy to their 
              kitchens and dining tables.
            </p>
          </div>

          <div className="team-section" style={{margin: '3rem 0'}}>
            <h2 style={{color: '#333', marginBottom: '2rem', textAlign: 'center'}}>Join Our Community</h2>
            <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap'}}>
              <div style={{textAlign: 'center', padding: '1.5rem'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>👨‍🍳</div>
                <h3 style={{color: '#333'}}>Home Cooks</h3>
                <p style={{color: '#666'}}>Share your family recipes</p>
              </div>
              <div style={{textAlign: 'center', padding: '1.5rem'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>��‍🍳</div>
                <h3 style={{color: '#333'}}>Professional Chefs</h3>
                <p style={{color: '#666'}}>Showcase your expertise</p>
              </div>
              <div style={{textAlign: 'center', padding: '1.5rem'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🍽️</div>
                <h3 style={{color: '#333'}}>Food Enthusiasts</h3>
                <p style={{color: '#666'}}>Discover new flavors</p>
              </div>
            </div>
          </div>

          <div className="cta-section" style={{textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'linear-gradient(135deg, #e74c3c, #c0392b)', borderRadius: '15px', color: 'white'}}>
            <h2 style={{marginBottom: '1rem'}}>Ready to Start Cooking?</h2>
            <p style={{marginBottom: '2rem', fontSize: '1.1rem'}}>
              Join thousands of food lovers sharing their recipes and experiences.
            </p>
            <Link 
              to="/register" 
              style={{
                background: 'white',
                color: '#e74c3c',
                padding: '1rem 2rem',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

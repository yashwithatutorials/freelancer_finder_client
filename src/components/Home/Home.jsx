import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import backgroundvideo from '../images/freelancerhome.mp4';
import About from './About';
import Domains from './Domains';

const Home = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsLoggedIn(!!user.email);
  }, []);

  const content = {
    browse: {
      text: 'Build your freelancing career on SB Works, with thousands of jobs posted every week.',
      button: 'Explore recently posted jobs',
      path: '/jobportal'
    },
    talent: {
      text: 'Find top-rated freelancers and agencies for your projects — fast and easy.',
      button: 'Find talent now',
      path: '/freelancer_finder'
    },
  };

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectPath', content[activeTab].path);
      navigate('/login');
      return;
    }
    navigate(content[activeTab].path);
  };

  return (
    <>
      <div className='video-wrapper'>
        <video autoPlay loop muted className='background-video'>
          <source src={backgroundvideo} type='video/mp4'/>
        </video>
        <div className='text-overlay'>
          <div className="content-container">
            <h1 className="main-heading">
              A Successful Freelancer-Client Relationship is Built on <span className="highlight-text">Trust, Communication, and Mutual Respect</span>.
            </h1>
            <div className="hero-container">
              <div className="hero-card">
                <div className="toggle-tabs">
                  <div className={`slider ${activeTab === 'talent' ? 'left' : 'right'}`} />
                  <div className='mainbtn'>
                    <button
                      className={`toggle-btn ${activeTab === 'talent' ? 'active' : ''}`}
                      onClick={() => setActiveTab('talent')}
                    >
                      Find talent
                    </button>
                    <button
                      className={`toggle-btn ${activeTab === 'browse' ? 'active' : ''}`}
                      onClick={() => setActiveTab('browse')}
                    >
                      Browse jobs
                    </button>
                  </div>
                </div>
                <div className="fade-in">
                  <p className="hero-text">
                    {content[activeTab].text}
                  </p>
                  <button className="cta-button" onClick={handleButtonClick}>
                    {content[activeTab].button}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <About id="about-section" />
      <Domains id="domain-section"/>
    </>
  );
};

export default Home;
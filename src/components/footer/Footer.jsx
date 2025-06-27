import React from 'react'
import './Footer.css'
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/FacebookRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Instagram, Facebook, LinkedIn, Twitter, YouTube } from '@mui/icons-material';
import img from '../images/sb_works.jpg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-wave"></div>
      
      <div className="footer-container">
       
        <div className="footer-column logo-column">
          <img src={img} alt="Freelancer Logo" className="footer-logo"/>
          <p className="footer-description">Connecting businesses with top freelance talent worldwide</p>
          
          <div className="language-selector">
            <span>🌐</span>
            <select>
              <option>India / English</option>
              <option>United States / English</option>
              <option>Europe / English</option>
            </select>
          </div>
          
          <div className="footer-contact">
            <p>❓ Help & Support</p>
            <p>♿ Accessibility</p>
          </div>
        </div>

     
        <div className="footer-column">
          <h3>Freelancer</h3>
          <ul>
            {['Categories', 'Projects', 'Contests', 'Freelancers', 'Enterprise', 
              'Innovation Challenges', 'AI Development', 'Preferred Freelancer'].map((item) => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-column">
          <h3>About</h3>
          <ul>
            {['About us', 'How it Works', 'Security', 'Investor', 'Sitemap', 
              'Stories', 'News', 'Team'].map((item) => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>
        <div className="footer-column">
          <h3>Terms</h3>
          <ul>
            {['Privacy Policy', 'Terms and Conditions', 'Copyright Policy', 
              'Code of Conduct', 'Fees and Charges'].map((item) => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="social-icons-container">
  <h3>Connect With Us</h3>
  <div className="social-icons">
    <a href="#" aria-label="Facebook">
      <FacebookIcon className="social-icon facebook" />
    </a>
    <a href="#" aria-label="Instagram">
      <InstagramIcon className="social-icon instagram" />
    </a>
    <a href="#" aria-label="LinkedIn">
      <LinkedInIcon className="social-icon linkedin" />
    </a>
    <a href="#" aria-label="Twitter">
      <TwitterIcon className="social-icon twitter" />
    </a>
    <a href="#" aria-label="YouTube">
      <YouTubeIcon className="social-icon youtube" />
    </a>
  </div>
</div>
    </footer>
  )
}

export default Footer
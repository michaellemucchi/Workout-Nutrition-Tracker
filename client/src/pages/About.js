import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './About.css';
import Modal from '../components/Modal';
import infoIcon from '../images/info.png'; // Using your existing icon

const About = () => {
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  return (
    <div className="about-wrapper">
      <NavBar />
      <div className="about-container">
        <h1>About the Fitness-Nutrition Tracker</h1>
        <p>
          The Fitness-Nutrition Tracker is designed to streamline and simplify the process of tracking meals and workouts, 
          ensuring that users can easily maintain their motivation for achieving their fitness and nutrition goals.
        </p>
        <h2>Mission Statement</h2>
        <p>
          Our mission is to provide an easy-to-use platform that empowers users to stay on track with their 
          fitness and nutrition goals, fostering a healthier lifestyle.
        </p>
      </div>
      <div className="about-columns">
        <div className="column">
          <div className="column-title">
            Technologies Used
          </div>
          <img src={infoIcon} alt="Info" className="info-icon" onClick={() => setIsTechModalOpen(true)} />
          {isTechModalOpen && (
            <Modal onClose={() => setIsTechModalOpen(false)}>
              <div className="modal-content">
                <ul>
                  <li>React</li>
                  <li>Node.js</li>
                  <li>SQLite</li>
                  <li>CSS</li>
                  <li>Express.js</li>
                  <li>Axios</li>
                  <li>dotenv</li>
                  <li>Bcrypt</li>
                  <li>jsonwebtoken</li>
                  <li>Charts.js</li>
                  <li>Nodemon</li>
                  <li>Body-Parser</li>
                  <li>Multer</li>
                  <li>Cors</li>
                  <li>Helmet</li>
                  <li>Express-Validator</li>
                </ul>
              </div>
            </Modal>
          )}
        </div>

        <div className="column">
          <div className="column-title">
            FAQ
          </div>
          <img src={infoIcon} alt="Info" className="info-icon" onClick={() => setIsFaqModalOpen(true)} />
          {isFaqModalOpen && (
            <Modal onClose={() => setIsFaqModalOpen(false)}>
              <div className="modal-content">
                <h3>Is this service free?</h3>
                <p>Yes, the Fitness-Nutrition Tracker is completely free to use!</p>

                <h3>How can I contribute to the project?</h3>
                <p>
                  If you're interested in contributing, please reach out to me through the contact information provided.
                </p>

                <h3>What features are planned for the future?</h3>
                <p>
                  We plan to add AI-powered scanning features to help users track their fitness and nutrition more effectively.
                </p>
              </div>
            </Modal>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;

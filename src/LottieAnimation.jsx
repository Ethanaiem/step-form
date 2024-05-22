// src/components/LottieAnimation.js
import React from 'react';
import Lottie from 'lottie-react';
import exampleAnimation from './assets/pinjump.json'; // Make sure to adjust the path
import kelndifyImage from './assets/Klendify.png';
import './LottieAnimation.css'
const LottieAnimation = () => {
    return (
        <div className="animation-container">
        <div className="lottie-background">
          <Lottie animationData={exampleAnimation} loop={true} />
        </div>
        <img src={kelndifyImage} alt="Foreground" className="foreground-image" />
      </div>
    );
};

export default LottieAnimation;

import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import exampleAnimation from './assets/tick.json'; // Make sure to adjust the path

const FinishingAnimation = () => {
    const [playAnimation, setPlayAnimation] = useState(true);
    const [animationCompleted, setAnimationCompleted] = useState(false);

    useEffect(() => {
        if (playAnimation) {
            const timer = setTimeout(() => {
                setPlayAnimation(false);
                setAnimationCompleted(true);
            }, 1000); // Adjust the duration as needed

            return () => clearTimeout(timer);
        }
    }, [playAnimation]); // Run when playAnimation changes

    return (
        <div style={{ width: 200, height: 200, margin: "0 auto" }}>
            <Lottie
                animationData={exampleAnimation}
                loop={false}
                autoplay={playAnimation}
                onComplete={() => setPlayAnimation(false)}
            />
        </div>
    );
};

export default FinishingAnimation;

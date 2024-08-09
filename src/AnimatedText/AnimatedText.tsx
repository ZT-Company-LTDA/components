import React, { ReactNode, useEffect, useState } from 'react';

interface AnimatedTextProps {
  children: ReactNode;
  id: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ children, id }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        const elementHeight = elementBottom - elementTop;
        
        if (elementTop < windowHeight && elementBottom > 0 && elementHeight < windowHeight) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [id]); 

  return (
    <div
      id={id} 
      className={`transition-opacity duration-[2000ms] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
};

export default AnimatedText;
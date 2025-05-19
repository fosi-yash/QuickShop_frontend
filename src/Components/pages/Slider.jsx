import React, { useState, useEffect, useRef } from 'react';
import '../../css/Slider.css'

const Slider = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const timeoutRef = useRef(null);

  // Auto slide every 4 seconds
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prevIndex) => (prevIndex === length - 1 ? 0 : prevIndex + 1));
    }, 4000);

    return () => {
      resetTimeout();
    };
  }, [current, length]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Manual slide handlers
  const nextSlide = () => {
    resetTimeout();
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    resetTimeout();
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length === 0) {
    return null;
  }

  return (
    <div className="slider ">
      <button className="prev" onClick={prevSlide}>❮</button>
      <button className="next" onClick={nextSlide}>❯</button>
      
      {slides.map((slide, index) => (
        <div
          className={index === current ? 'slide active '  : 'slide'}
          
          key={index}
        >
          {index === current && (
            <img src={slide.image} alt={slide.caption} className="slide-image" />
          )}
          {index === current && <p className="caption">{slide.caption}</p>}
        </div>
      ))}

      <div className="dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={current === idx ? 'dot active' : 'dot'}
            onClick={() => {
              resetTimeout();
              setCurrent(idx);
            }}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slider;

import React, { useState, useEffect } from 'react';
import styles from './Carousel.module.css';

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselContainer}>
        <button className={styles.carouselButton} onClick={prevSlide}>❮</button>
        <div className={styles.carouselSlide} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {items.map((item, index) => (
            <div className={styles.slide} key={index}>
              <img src={item.image} alt={`Slide ${index + 1}`} className={styles.carouselImage} />
              <div className={styles.indicators}>
                {items.map((_, idx) => (
                  <span
                    key={idx}
                    className={`${styles.indicator} ${currentIndex === idx ? styles.active : ''}`}
                    onClick={() => goToSlide(idx)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className={styles.carouselButton} onClick={nextSlide}>❯</button>
      </div>
    </div>
  );
};

export default Carousel;

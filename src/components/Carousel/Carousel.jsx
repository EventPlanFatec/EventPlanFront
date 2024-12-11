import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import styles from './Carousel.module.css';

const Carousel = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  const fetchActiveAnuncios = async () => {
    const anunciosRef = collection(db, 'anuncios');
    const q = query(anunciosRef, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    const anuncios = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .slice(0, 5); // Limita o número de imagens a 5
    setItems(anuncios);
  };

  useEffect(() => {
    fetchActiveAnuncios();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 15000); // 15 segundos por imagem
    return () => clearInterval(interval);
  }, [items]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (items[currentIndex]?.audioUrl) {
        audioRef.current.src = items[currentIndex].audioUrl;
        audioRef.current.play().catch((err) => console.error('Erro ao reproduzir áudio:', err));
      }
    }
  }, [currentIndex, items]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  if (items.length === 0) {
    return <div className={styles.carousel}>Nenhum anúncio disponível no momento.</div>;
  }

  return (
    <div className={styles.carousel}>
      <audio ref={audioRef} />
      <button className={styles.carouselButton} onClick={prevSlide}>❮</button>
      <div
        className={styles.carouselSlide}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div className={styles.slide} key={item.id}>
            <img
              src={item.imageUrl}
              alt={`Anúncio ${index + 1}`}
              className={styles.carouselImage}
            />
          </div>
        ))}
      </div>
      <button className={styles.carouselButton} onClick={nextSlide}>❯</button>
    </div>
  );
};

export default Carousel;

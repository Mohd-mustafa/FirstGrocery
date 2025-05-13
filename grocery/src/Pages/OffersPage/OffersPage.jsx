// src/OffersPage.js
import React, { useState } from 'react';
import './OffersPage.css'; // Import CSS file for styling

// Import images
import grocery from '../../assets/grocery.png';
import clothes from '../../assets/clothes.png';
import electronics from '../../assets/electronics.jpeg';
import shoes from '../../assets/shoes.png';
import vegetables from '../../assets/vegetables.png';

const images = [grocery, clothes, electronics, shoes, vegetables];


const OffersPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
     
    const nextSlide=() =>{
        setCurrentIndex((prevIndex)=>(prevIndex + 1) % Math.ceil( images.length /3));
    };
    const prevSlide = () => {
        setCurrentIndex(
          (prevIndex) => (prevIndex - 1 + Math.ceil(images.length / 3)) % (images.length / 3)
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
      };

     const slides=[];
     for(let i=0;i<images.length;i+=3){
        slides.push(images.slice(i,i+3));
     }


  return (
    <div className="slider-container">
      <div className='slider'>
        {slides[currentIndex].map((img,index)=>(
                      <img key={index} src={img} alt={`Slide ${index}`} className="slider-image" />

        ))}
        </div>  
        <div className="dots">
  {slides.map((_, index) => (
    <span
      key={index}
      className={`dot ${currentIndex === index ? 'active' : ''}`}
      onClick={() => goToSlide(index)}
    ></span>
  ))}
</div>
    </div>
  );
};

export default OffersPage;

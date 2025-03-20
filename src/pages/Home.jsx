import React, { useEffect, useState } from "react";

import '../App.css'
import './style/Home.css'

import img1 from './imgs/home/1.jpg';
import img2 from './imgs/home/2.jpg';
import img3 from './imgs/home/3.jpg';

const Home = () => {
    const images = [img1, img2, img3];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() =>{
        const intervalId = setInterval(() => {
            if(currentImageIndex === images.length - 1){
                setCurrentImageIndex(0);
            }
            else{
                setCurrentImageIndex(currentImageIndex + 1);
            }
        }, 4000)

        return () => {clearInterval(intervalId)};
    });

    return(
        
        <div>
            <section className="top-section">
                <div className="home-background-images">
                    <img src={images[currentImageIndex]} alt="home-backgrounds"></img>
                </div>

                
            </section>

            
        </div>
       
    );
};

export default Home;
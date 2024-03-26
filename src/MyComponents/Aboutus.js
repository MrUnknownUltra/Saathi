import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import aboutushindi from './Images/hindiaboutus.png';
import aboutuseng from './Images/aboutus (2).png';
import Speech from './speech';
import { useTranslation } from 'react-i18next';
const AboutUs = ({ language }) => {
  const { t, i18n  } = useTranslation();
    console.log("Hie")
  // Determine which image to display based on the selected language
  const imageUrl =  i18n.language === 'hi' ? aboutushindi : aboutuseng

  return (
    <div>
      
      <Navbar />
      <Speech  />
      <img src={imageUrl} alt="About Us" />
      
    </div>
  );
};

export default AboutUs;

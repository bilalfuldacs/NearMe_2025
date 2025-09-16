// SignupPicture.js
import React from "react";
import Loading from '../../assets/istockphoto-1305268276-612x612.jpg';
const SignUpFormSvg = () => {
  return (
    <img 
      src={Loading} 
      alt="Signup Illustration" 
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        maxWidth: '100%',
        maxHeight: '100%'
      }}
    />
  );
};

export default SignUpFormSvg;
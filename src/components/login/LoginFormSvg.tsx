import React from 'react'
import loginGif from '../../assets/login.gif'
function LoginFormSvg() {
    return (
        <img 
          src={loginGif} 
          alt="Login Illustration" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      );
}

export default LoginFormSvg
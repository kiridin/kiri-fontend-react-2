import React from 'react';
import "./index.css";


export default function Home() {
  return (
    <div>
      {/* Título do CRUD */}
      <h1 style={{color:"black", marginTop:"50px",marginLeft:"400px", position:"absolute"}}>Crud em React, segundo desafio...</h1>

      {/* Logo */}
      <img 
        src="https://cdn1.iconfinder.com/data/icons/education-set-3-3/74/15-512.png" 
        alt="Logo" 
        style={{scale:"0.5",marginLeft:"440px",}} 
      />
    </div>
  );
}

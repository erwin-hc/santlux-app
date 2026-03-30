import React from "react";

const PersianaRolo = ({ width = "400", height = "400", className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 400 400" width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cabeçote / Trilho Superior */}
        <rect x="10" y="5" width="380" height="20" rx="2" fill="#8C8C8C" stroke="#4A4A4A" strokeWidth="1" />
        <rect x="5" y="5" width="10" height="25" rx="1" fill="#707070" stroke="#4A4A4A" strokeWidth="1" />
        <rect x="385" y="5" width="10" height="25" rx="1" fill="#707070" stroke="#4A4A4A" strokeWidth="1" />

        {/* Tecido da Persiana */}
        <rect x="18" y="25" width="364" height="350" fill="#A3A3A3" />

        {/* Cordão Lateral */}
        <line x1="12" y1="30" x2="12" y2="380" stroke="#D1D1D1" strokeWidth="2" />
        <circle cx="12" cy="385" r="3" fill="#B0B0B0" />

        {/* Barra Inferior (Peso) */}
        <rect x="18" y="375" width="364" height="8" fill="#707070" stroke="#4A4A4A" strokeWidth="0.5" />
      </svg>
    </div>
  );
};

export default PersianaRolo;

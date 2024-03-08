import React from "react";

function Home(){
  const imageUrl = process.env.PUBLIC_URL + '/home.webp';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <img src={imageUrl} alt="Home" style={{ 
        maxWidth: '800px',
        maxHeight: '800px',
        width: 'auto',
        height: 'auto'
      }} />
    </div>
  );
}

export default Home;
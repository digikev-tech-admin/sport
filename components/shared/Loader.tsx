import React from 'react'

const Loader = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        {/* <p>Loading...</p> */}
        <span className="loader"></span>
      </div>
  )
}

export default Loader
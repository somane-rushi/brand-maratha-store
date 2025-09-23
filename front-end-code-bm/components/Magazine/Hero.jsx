"use client";

import React from 'react'

const Hero = ({ banner }) => {
  return (
    <>
      <section className='bs-banner typ-magazine' style={{ "--bg-image": `url(${banner?.image})` }}>
        <div className="container h-100">
          <div className="col-md-12 h-100">
            <div className="content-wrapper h-100">
              <h2 className='heading max-560 fw-6'>{banner?.title}</h2>
              <p className='para mb_0'>{banner?.subtitle}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero

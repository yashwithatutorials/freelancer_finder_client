import React from 'react'
import image from '../images/freelanceabout.png'
import './About.css'

const About = ({id}) => {
  return (
    <div id={id} style={{backgroundColor:"black",paddingTop:"40px"}}>
    <h1 style={{textAlign:"center",color:"rgb(8, 176, 188)",paddingTop:"130px",fontSize:"70px"}}>ABOUT US</h1>
        <div className='about_page'>
        <div className='about_text'>
        <h2 style={{fontSize:"40px"}}>Welcome to SB Works</h2>
          <p>
            SB WORKS is a revolutionary freelancing platform that transforms the way clients connect with skilled freelancers. Our intuitive interface allows clients to post diverse projects—from creative endeavors to technical tasks—while freelancers can seamlessly bid based on their expertise.
          </p>
          <p>
            We prioritize efficiency and transparency. Clients can review freelancer profiles, assess past work, and select the ideal candidate. Once selected, collaboration happens within the platform, streamlining the entire workflow.
          </p> </div>
        <div className='about_img'>
<img src={image} alt='about_image' />
        </div>
        </div>

    </div>
  )
}

export default About
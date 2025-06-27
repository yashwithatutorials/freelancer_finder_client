import './App.css'
import Login from './components/Login/Login'
// import Navbar from './components/navbar/Navbar'
import Signup from './components/Login/Signup'
import { BrowserRouter,Route,Routes } from 'react-router-dom'

import Home from './components/Home/Home'
import LoginNav from './components/Login/LoginNav'
import About from './components/Home/About'
import ViewProfile from './components/profile/ViewProfile'
import Jobportal from './components/find_job/Jobportal'
import Freelance_finder from './components/find_freelancer/Freelance_finder'
import Job_details from './components/job_details/Job_details'
import Postjob from './components/job_details/Postjob'
import Details from './components/find_freelancer/Details'
import ViewJob from './components/find_job/Viewjob'
import ChatRoom from './components/chat/ChatRoom'
import AppliedJobs from './components/find_job/AppliedJobs'
import Footer from './components/footer/Footer'
function App() {
 

  return (
    <>
   <LoginNav/>
     <BrowserRouter>
      <Routes>
      
      <Route path='/' element={<Home/>}/>
     <Route path='/ViewProfile' element={<ViewProfile/>}/>
     <Route path='/jobdetails' element={<Job_details/>}/>
    <Route path='/jobportal' element={<Jobportal/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path="/messages" element={<ChatRoom />} />
        <Route path='/appliedjobs' element={<AppliedJobs/>}/>
        <Route path="/freelancer/:id" element={<Details/>}/>
        <Route path="/job/:jobId" element={<ViewJob/>}/>
        <Route path='/postjob' element={<Postjob/>}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path='/Loginnav' element={<LoginNav/>}/>
        <Route path='/About' element={<About/>}/>
        {/* <Route path='/Navbar' element={<Navbar/>}/> */}
        <Route path='/Home' element={<Home/>}/>
        <Route path='/freelancer_finder' element={<Freelance_finder/>}/>
        
        {/* <Route path='/Logout' element{<Logout/>}/> */}
      </Routes>
     </BrowserRouter>
      {/* <Home/> */}
     {/* <Footer/> */}
     <Footer/>
    </>
  )
}

export default App

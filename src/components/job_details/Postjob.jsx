
import React, { useState } from 'react';
import './Postjob.css';          

const Postjob = () => {
 
  const [title,       setTitle]       = useState('');
  const [descrip,     setDescrip]     = useState('');
  const [requirement, setRequirement] = useState('');
  const [skillreq,    setSkillreq]    = useState('');
  const [category,    setCategory]    = useState('');
  const [loca,        setLoca]        = useState('');
  const [showPopup,setShowPopup]=useState(false);
  const [popupMessage,setPopupMessage]=useState('');
  const [isSuccess,setIsSuccess]=useState(false);
  const email = React.useMemo(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u.email || '';
  }, []);
const showNotification=(message,success)=>{
  setPopupMessage(message);
  setIsSuccess(success);
  setShowPopup(true);
  setTimeout(()=>setShowPopup(false),3000);
}
  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !descrip || !requirement || !category || !loca) {
      showNotification('please fill in every required fields.',false);
      return ;
    }

    try {
      const res = await fetch('https://freelancer-finder.onrender.com/api/jobs', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          email,                    
          title,
          descrip,
          loca,
          category,
          requirement,
          skillreq
        })
      });

      if (!res.ok) throw new Error(await res.text());

      
      showNotification('🎉  Job posted successfully',true);
      setTitle(''); setDescrip(''); setRequirement('');
      setSkillreq(''); setCategory(''); setLoca('');
    } catch (err) {
      console.error('Post job error ➜', err);
      showNotification('Job post failed: ' + err.message,false);
    }
  }

  return (
    <div className="post">
    {showPopup&&(
      <div className={`popup-notification ${isSuccess?'success':'error'}`}>
      {popupMessage}
      </div>
    )}
      <form className="job-form-container" onSubmit={handleSubmit}>
        <div className="job-form-group">
          <label className="job-form-label">Job Title<span>*</span></label>
          <input
            className="job-form-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Full‑Stack Developer"
          />
        </div>
        <div className="job-form-group">
          <label className="job-form-label">Job Description<span>*</span></label>
          <textarea
            className="job-form-textarea"
            value={descrip}
            onChange={e => setDescrip(e.target.value)}
            placeholder="Describe the job..."
          />
        </div>

        <div className="job-form-group">
          <label className="job-form-label">Key Requirements<span>*</span></label>
          <textarea
            className="job-form-textarea"
            value={requirement}
            onChange={e => setRequirement(e.target.value)}
            placeholder="Comma‑separated list or paragraphs"
          />
        </div>

        <div className="job-form-group">
          <label className="job-form-label">Skills Required</label>
          <textarea
            className="job-form-textarea"
            value={skillreq}
            onChange={e => setSkillreq(e.target.value)}
            placeholder="e.g. React, Node, MongoDB"
          />
        </div>
        <div className="job-form-row">
          <div>
            <label className="job-form-label">Job Category<span>*</span></label>
            <select
              className="job-form-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">Select</option>
              <option>Programming</option>
              <option>Design</option>
              <option>Marketing</option>
            </select>
          </div>

          <div>
            <label className="job-form-label">Job Location<span>*</span></label>
            <select
              className="job-form-select"
              value={loca}
              onChange={e => setLoca(e.target.value)}
            >
              <option value="">Select</option>
              <option>Bangalore</option>
              <option>Hyderabad</option>
              <option>Remote</option>
            </select>
          </div>
        </div>

        <button type="submit" className="job-form-button">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Postjob;

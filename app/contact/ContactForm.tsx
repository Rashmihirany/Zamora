'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input type="text" className="form-input" placeholder=" " required />
        <label className="form-label">FULL NAME</label>
      </div>
      <div className="form-group">
        <input type="email" className="form-input" placeholder=" " required />
        <label className="form-label">EMAIL ADDRESS</label>
      </div>
      <div className="form-group">
        <input type="text" className="form-input" placeholder=" " />
        <label className="form-label">SUBJECT</label>
      </div>
      <div className="form-group">
        <textarea
          className="form-input contact-textarea"
          rows={5}
          placeholder=" "
          required
        ></textarea>
        <label className="form-label">YOUR MESSAGE</label>
      </div>
      <button className="btn btn-primary btn-hover-shine full-width" type="submit">
        {submitted ? 'MESSAGE SENT ✓' : 'SEND MESSAGE'}
      </button>
    </form>
  );
}

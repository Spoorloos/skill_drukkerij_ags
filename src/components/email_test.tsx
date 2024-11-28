import React from 'react';

export default function Email() {
  return (
    <div className="form">
      <h2>Contact Us</h2>
      <form action="https://formsubmit.co/testfhh1914@gmail.com" method="POST">
        <input type="text" name="name" required placeholder="Name" />
        <input type="email" name="email" required placeholder="Email" />
        <input type="text" name="subject" required placeholder="Subject" />
        <textarea name="msg" required placeholder="Message"></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

import React from 'react'

const footer = () => {
  return (
    <div>
      <footer className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-10 bg-base-200 text-base-content footer">
        <nav >
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
        <form >
          <h6 className="footer-title">Newsletter</h6>
          <fieldset className="form-control w-80">
            <label className="label">
              <span className="label-text">Enter your email address</span>
            </label>
            <div className="relative w-fit">
              <input type="text" placeholder="username@site.com" className="input input-bordered w-full " />
              <br />
            </div>
              <button className="btn btn-secondary bg-base-100 border-0 text-base-content hover:bg-fuchsia-500 hover:text-white">Subscribe</button>
          </fieldset>
        </form>
      </footer>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>Copyright © 2024 - All right reserved by Gadget Shop Ltd.</p>
          <p>Developed by: Shahriar Sakhawat Tahin</p>
          <p>Email: <a href="mailto:tahin18t@gmail.com" className="link link-hover">tahin18t@gmail.com</a></p>
          <p>Website: <a href="https://sites.google.com/diu.edu.bd/tahin1383" className="link link-hover">Your Website</a></p>
        </aside>
      </footer>
    </div>
  )
}

export default footer
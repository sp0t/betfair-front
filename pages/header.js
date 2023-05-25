import Link from "next/link"
import React from "react";
import { useState } from "react";

const Header = () => {
  const [menustate, setMenuState] = useState(false);

  const handleMouseEnter = () => {
      setMenuState(true);
  }

  const handleMouseLeave = () => {
    setMenuState(false)
  }

  return(
    <nav className="flex items-center justify-between flex-wrap bg-slate-900 p-6">
      <div className="flex items-center flex-shrink-0 text-white ms-10">
        <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg>
        <span className="font-semibold text-2xl tracking-tight">Betfair-Bot</span>
      </div>

      <button onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
        <label className="sm:hidden cursor-pointer flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"><svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg></label>
      </button>
    

      <div className="hidden w-full flex-grow sm:flex sm:items-center text-end sm:w-auto">
        <div className="text-base sm:text-lg sm:flex-grow mr-7">
          <a href="/" className="block mt-4 sm:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
            Home
          </a>
          <a href="/setting" className="block mt-4 sm:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
            Setting
          </a>
          {/* <a href="/authentication" className="block mt-4 sm:inline-block lg:mt-0 text-teal-200 hover:text-white">
            Authentication
          </a> */}
        </div>
      </div>

      {menustate && <div id = 'togglebar' className="w-full sm:items-center text-end sm:w-auto" onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
        <div className="text-lg">
          <a href="/" className="block mt-4 sm:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
            Home
          </a>
          <a href="/setting" className="block mt-4 sm:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
            Setting
          </a>
          {/* <a href="/authentication" className="block mt-4 sm:inline-block lg:mt-0 text-teal-200 hover:text-white">
            Authentication
          </a> */}
        </div>
      </div>}
    </nav>
  )
}

export default Header;
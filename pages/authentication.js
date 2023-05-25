import { useState } from "react";
import React from "react";
import axios from 'axios'
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import Link from "next/link"
// import { Header } from "./../component/header";

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
        <label className="sm:hidden cursor-pointer flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"><svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg></label>
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

export default function Authentication() {
  return (
    <>
      <div className="h-full">
        <Header />
        <div></div>
        <div className="bg-gradient-to-r from-green-600 to-[#233d26] min-h-screen">
          <div className="pt-10 m-auto flex justify-center">
            <div className="h-[600px] m-3 sm:w-[440px] sm:m-auto sm:mb-3 lg:mb-0 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg sm:p-4">
              <div className="mb-2 pt-6 lg:mb-4">
                <select className="cursor-pointer block w-full p-1 mb-4 lg:p-2 lg:mb-6 overflow-auto text-lg text-center text-white border border-gray-300 rounded-lg bg-blue-600 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <option className="cursor-pointer">Betfair</option>
                  <option className="cursor-pointer">PS3838</option>
                </select>
              </div>
              <div className="h-[480px] p-3 bg-blue-600 rounded-lg">
                <div className="block">
                <label for="username" className="text-white text-lg block pb-2">Username</label>
                <input type="text" id="username" className="bg-blue-600 border-solid  border-2 rounded-md text-base text-white p-2 w-full" placeholder="John" required></input>

                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}

import { useState } from "react";
import React from "react";
import axios from 'axios'
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from "./header";

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

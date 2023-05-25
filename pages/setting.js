import Link from "next/link"
import { useState } from "react";
import React from "react";
import axios from 'axios'
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
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


export default function Setting() {
  const [mornitorData, setMornitorData] = useState([]);
  const [sportBt, setSportBt] = useState({});
  const [sportPs, setSportPs] = useState({});
  const [sportBtname, setSportBtname] = useState('2002 Winter Olympics');
  const [sportPsname, setSportPsname] = useState('Alpine Skiing');
  const [leagueBt, setLeagueBt] = useState({});
  const [leaguePs, setLeaguePs] = useState({});
  const [sportName, setSportName] = useState('');
  const [leagueBtids, setLeagueBtids] = useState([]);
  const [leaguePsids, setLeaguePsids] = useState([]);

  const sortObject = (mess) => {

    const sortedKeys = Object.keys(mess).sort();
    const sortedObj = {};
    sortedKeys.forEach(key => {
      sortedObj[key] = mess[key];
    });

    return sortedObj;
  } 

  React.useEffect(() => {
    const run = async () => {
      var [mornitor, sport, league] = await Promise.all([
        await axios.get(process.env.NEXT_PUBLIC_APIURL + 'getMornitor'),
        await axios.get(process.env.NEXT_PUBLIC_APIURL + 'getSport'),
        await axios.get(process.env.NEXT_PUBLIC_APIURL + 'getLeague')
      ])
    
      setMornitorData(mornitor.data);
      setSportBt(sortObject(sport.data.betfair));
      setSportPs(sortObject(sport.data.ps3838));
      setLeagueBt(sortObject(league.data.betfair));
      setLeaguePs(sortObject(league.data.ps3838['Badminton']));
    };

    run();
  }, []);

  React.useEffect(() => {
    setLeaguePsids([]);
    setLeagueBtids([]);
  }, [sportBtname, sportPsname]);

  const selectSportPs = async(val) => {
    setSportPsname(val)
    var ret =  await axios.get(process.env.NEXT_PUBLIC_APIURL + 'getLeague');
    setLeaguePs(sortObject(ret.data.ps3838[val]));
    setLeaguePsids([]);
  }

  const selectSportBt = async(val) => {
    setSportBtname(val)
    setLeagueBtids([]);
  }

  const checkPs = (state, value) => {
    var tmp =  JSON.parse(JSON.stringify(leaguePsids));
    if(state) tmp.push(leaguePs[value])
    else {
      const index = tmp.indexOf(leaguePs[value]);
      if (index !== -1) {
        tmp.splice(index, 1);
      }
    }
    setLeaguePsids(tmp)
  }

  const checkBt = (state, value) => {
    var tmp =  JSON.parse(JSON.stringify(leagueBtids));
    if(state) tmp.push(leagueBt[value])
    else {
      const index = tmp.indexOf(leagueBt[value]);
      if (index !== -1) {
        tmp.splice(index, 1);
      }
    }
    setLeagueBtids(tmp)
  }

  const removeSport = React.useCallback(async (index, name) => {
    var temp = JSON.parse(JSON.stringify(mornitorData));

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'removeMornitor', { sport: name });
      temp.splice(index, 1);
      toast.success(`Sport ${name} removed.`);
      setMornitorData(temp);
    } catch (error) {
      console.error(error);
    }
  }, [mornitorData])

  const addMornitor = React.useCallback(async() => {

    var temp = JSON.parse(JSON.stringify(mornitorData));

    if (sportName == '') {
      toast.warn(`Please input sport name for mornitor.`);
      return;
    }

    for (var x in temp) {
      if (temp[x].sport == sportName) {
        toast.warn(`${sportName} already added. Please remove it before add.`);
        return;
      }
    }

    if (leagueBtids.length == 0) {
      toast.warn(`Please check competitions for ${sportBtname}.`);
      return;
    }

    if (leaguePsids.length == 0) {
      toast.warn(`Please check competitions for ${sportPsname}.`);
      return;
    }

    var data = {};
    data.sport = sportName;
    data.sites = [];

    var tmp = {};
    tmp.name = 'betfair';
    tmp.sportid = sportBt[sportBtname];
    tmp.competition = [];
    tmp.competition = leagueBtids;

    data.sites.push(tmp);

    tmp = {};
    tmp.name = 'ps3838';
    tmp.sportid = sportPs[sportPsname];
    tmp.competition = [];
    tmp.competition = leaguePsids

    data.sites.push(tmp);

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'addMornitor', { sport: sportName, sites: data.sites});
      temp.push(data);
      setMornitorData(temp);
      toast.success(`Sucess.`);
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => checkbox.checked = false);

      setLeagueBtids([]);
      setLeaguePsids([]);
    } catch (error) {
      toast.error(`Failed.`);
      console.error(error);
    } 

  },[mornitorData, sportName, sportBtname, sportPsname, leagueBtids, leaguePsids])

  return (
    <>
      <div className="">
        <Header />
        <div className="bg-gradient-to-r from-green-600 to-[#233d26] min-h-screen">
          <div className="pt-10 m-auto justify-center place-items-center xl:flex">
            <div className="m-2 border-solid sm:w-[630px] sm:m-auto bg-stone-800 p-1 rounded-lg xl:mr-10 xl:p-2">
              <div className="justify-center mb-2 p-2 sm:w-[400px] sm:m-auto">
                  <div className="flex justify-center w-full font-bold text-white text-2xl py-1 lg:py-2">
                    <h1>Sport Name</h1>
                  </div>
                  <div className="flex justify-center w-full font-bold text-white text-2xl pt-2">
                    <input type="text" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" placeholder="Please insert sport name.." onChange={(e) => setSportName(e.target.value)} required>          
                    </input>
                    <button type="button" className="text-white ml-5 bg-blue-700 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={addMornitor}>
                        Insert
                        <svg aria-hidden="true" className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                  </div>
              </div>
              <div className="sm:flex ">
                <div className="h-[580px] sm:w-[320px] m-1.5 lg:m-2 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg mb-4 lg:mb-0">
                  <div className="mb-2 text-2xl lg:text-3xl font-bold flex justify-center w-full text-purple-900 lg:mb-4">
                    <h1>Betfair</h1>
                  </div>
                  <div className="relative mb-2 lg:mb-4">
                    <select className="cursor-pointer block w-full p-1 mb-4 lg:p-2 lg:mb-6 overflow-auto text-lg text-center text-white border border-gray-300 rounded-lg bg-blue-600 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {selectSportBt(e.target.value)}}>
                      {
                        Object.entries(sportBt).map(([key, value]) => (
                          <option className="cursor-pointer" key = {value}>{key}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div className="h-[445px] overflow-y-auto p-1 lg:p-2 bg-blue-50 rounded-lg">
                    {
                      Object.entries(leagueBt).map(([key, value]) => (
                      <div className="justify-center p-2 mb-1 lg:mb-2 text-blue-800 rounded-lg text-base bg-orange-400 hover:bg-orange-500 dark:bg-gray-800 hover:text-blue-900 dark:text-blue-400 flex" key = {value}>
                        <div className="flex justify-between items-center ml-2 lg:ml-4	w-full text-lg font-bold">
                          <div className="flex items-center justify-center">{key}</div>
                          <input className="cursor-pointer" type="checkbox" onChange={(e) => checkBt(e.target.checked, key)}/>
                        </div>
                      </div>
                      ))
                    }
                  </div>
                </div>
                <div className="h-[580px] sm:w-[320px] m-1.5 lg:m-2 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg">
                  <div className="mb-2 text-2xl lg:text-3xl font-bold flex justify-center w-full text-purple-900 lg:mb-4">
                    <h1>PS3838</h1>
                  </div>
                  <div className="relative mb-2 lg:mb-4">
                    <select className="cursor-pointer block w-full p-1 mb-4 lg:p-2 lg:mb-6 overflow-auto text-lg text-center text-white border border-gray-300 rounded-lg bg-blue-600 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {selectSportPs(e.target.value)}}>
                        {
                          Object.entries(sportPs).map(([key, value]) => (
                            <option className="cursor-pointer" id = {value} key = {value}>{key}</option>
                          ))
                        }
                      </select>
                  </div>
                  <div className="h-[445px] overflow-y-auto p-1 lg:p-2 bg-blue-50 rounded-lg">
                    {
                        Object.entries(leaguePs).map(([key, value]) => (
                        <div className="justify-center p-2 mb-1 lg:mb-2 text-blue-800 rounded-lg text-base bg-orange-400 hover:bg-orange-500 dark:bg-gray-800 hover:text-blue-900 dark:text-blue-400 flex" key = {value}>
                          <div className="flex justify-between items-center ml-2 lg:ml-4	w-full text-lg font-bold">
                            <div className="flex items-center" >{key}</div>
                            <input className="cursor-pointer" type="checkbox" onChange={(e) => checkPs(e.target.checked, key)}/>
                          </div>
                        </div>
                        ))
                      }
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[600px] sm:w-[400px] sm:m-auto m-2 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg xl:ml-10">
              <div className="mb-2 text-2xl lg:text-3xl lg:mb-4 font-bold flex justify-center w-full text-purple-900">
                <h1>Sport</h1>
              </div>
              <div className="h-[530px]	overflow-y-auto bg-blue-50 p-1 lg:p-2 rounded-lg">
                {mornitorData.map((val, index) => (
                  <div className="items-center justify-center p-2 mb-1 lg:mb-2 text-blue-800 rounded-lg text-base bg-orange-400 hover:bg-orange-500 dark:bg-gray-800 hover:text-blue-900 dark:text-blue-400 flex" key={index}>
                    <div className="flex justify-between items-center	w-full text-lg font-bold">
                    <Image className=" ml-1 lg:ml-2 rounded-lg" width="25" height="25" src={`/images/${val.sport}.png`} alt="Rounded avatar"></Image>
                      <div className="flex justify-cente px-1">{val.sport}</div>
                      <button type="button" className="text-white p-2 bg-blue-700 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-full" onClick={(e) => removeSport(index, val.sport)}>
                        <svg fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}

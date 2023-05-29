import { useState } from "react";
import React from "react";
import axios from 'axios'
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
// import Header from "./../pages/header";
import Header from "./../component/header";

const SportCard = ({ img = '', name = '', _diffmode = '0', _betmode = '0', _monit = true, _betting = false, _playmode = false, _market = '0', count = 0}) => {
  const [diffmode, setDiffmodeState] = useState(_diffmode);
  const [betmode, setBetmode] = useState(_betmode);
  const [monit, setMonitState] = useState(_monit);
  const [betting, setBettingState] = useState(_betting);
  const [playmode, setPlaymodeState] = useState(_playmode);
  const [market, setMarketState] = useState(_market);

  const setDiffMode = async (check) => {
    setDiffmodeState(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setDiffMode', { sport: name, state: check });
      console.log(result)

      if (check == '1') toast.success(`Percent Diff Mode setted on ${name} matchs.`);
      else toast.success(`Fixed Diff Mode setted on ${name} matchs.`);
    } catch (error) {
      toast.error(`${name} Diff Mode set error.`);
      setChecked(!check)
      console.error(error);
      return;
    }
  }

  const setBetMode = async (check) => {
    setBetmode(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setBetMode', { sport: name, state: check });
      console.log(result)

      if (check == '1') toast.success(`Percent Bet Mode setted on ${name} matchs.`);
      else toast.success(`Fixed Bet Mode setted on ${name} matchs.`);
    } catch (error) {
      toast.error(`${name} Bet Mode set error.`);
      setChecked(!check)
      console.error(error);
      return;
    }
  }

  const setMonit = async (check) => {
    setMonitState(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setMonit', { sport: name, state: check });

      if (check) toast.success(`Will monit on ${name} matchs.`);
      else toast.success(`Will stop montoring on ${name} matchs.`);
    } catch (error) {
      toast.error(`${name} monit set error.`);
      setChecked(!check)
      console.error(error);
      return;
    }
  }

  const setBetting = async (check) => {
    setBettingState(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setBetting', { sport: name, state: check });
      console.log(result)

      if (check) toast.success(`Will bet on ${name} matchs.`);
      else toast.success(`Will stop betting on ${name} matchs.`);
    } catch (error) {
      toast.error(`${name} betting set error.`);
      setChecked(!check)
      console.error(error);
      return;
    }
  }

  const setPlayMode = async (check) => {
    setPlaymodeState(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setPlayMode', { sport: name, state: check });
      console.log(result)

      if (check) toast.success(`Will bet on inPlay ${name} matchs.`);
      else toast.success(`Will bet all ${name} matchs.`);
    } catch (error) {
      toast.error(`${name} set error.`);
      setChecked(!check)
      console.error(error);
      return;
    }
  }

  const setMarket = async (check) => {
    setMarketState(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setMarket', { sport: name, state: check });
      console.log(result)

      if (check) toast.success(`${name} market setting success.`);
    } catch (error) {
      toast.error(`${name} market setting error.`);
      setChecked(!check)
      console.error(error);
      return;
    }
  }

  return (
    <div className="p-2 mb-1 sm:p-3 sm:mb-2 items-center text-blue-700 rounded-lg text-base bg-orange-400 hover:bg-orange-500 hover:text-blue-800 dark:bg-gray-800 dark:text-blue-400">
      <div className="flex mb-2">
        <Image className="rounded-lg w-auto h-auto" width="25" height="25" src={img} alt="Rounded avatar"></Image>
        <div className="flex items-center text-lg font-bold ml-2">{name}</div>
      </div>
      <div className="flex">
        <div className="border border-gray-200 rounded-lg p-2 m-auto">
          <h3 className="font-semibold text-gray-900 dark:text-white pl-2">DiffMode</h3>
          <ul className="w-1/3 text-sm font-medium text-gray-900  dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="radio" value='0' checked={diffmode == "0"} name={`${count}-diffmode`} onChange={(e) => setDiffMode(e.target.value)} className="w-4 h-4 text-blue-600 bg-gray-100  focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer"></input>
                <label htmlFor={`${count}-diffmode`} className="w-full py-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">Fixed </label>
              </div>
            </li>
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="radio" value='1' checked={diffmode == "1"} name={`${count}-diffmode`} onChange={(e) => setDiffMode(e.target.value)} className="w-4 h-4 text-blue-600 bg-gray-100  focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer"></input>
                <label htmlFor={`${count}-diffmode`} className="w-full py-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">Percent</label>
              </div>
            </li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-lg p-2 m-auto">
          <h3 className="font-semibold text-gray-900 dark:text-white pl-2">BetMode</h3>
          <ul className="w-1/3 text-sm font-medium text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="radio" value="0" checked={betmode == "0"} onChange={(e) => setBetMode(e.target.value)} name={`${count}-betmode`} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer"></input>
                <label htmlFor={`${count}-betmode`} className="w-full py-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">Fixed </label>
              </div>
            </li>
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="radio" value="1" checked={betmode == "1"} onChange={(e) => setBetMode(e.target.value)} name={`${count}-betmode`} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer"></input>
                <label htmlFor={`${count}-betmode`} className="w-full py-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">Percent</label>
              </div>
            </li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-lg p-2 m-auto">
          <ul className="w-1/3 text-sm font-medium text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="checkbox" value="" name="inplay" checked={playmode} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer" onChange={(e) => setPlayMode(e.target.checked)}></input>
                <label htmlFor="inplay" className="w-full py-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">InPlay </label>
              </div>
            </li>
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="checkbox" value="" name="monit" checked={monit} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer" onChange={(e) => setMonit(e.target.checked)}></input>
                <label htmlFor="monit" className="w-full py-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">Monit </label>
              </div>
            </li>
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="checkbox" value="" name="betting" checked={betting} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer" onChange={(e) => setBetting(e.target.checked)}></input>
                <label htmlFor="betting" className="w-full py-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">Betting</label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

 const Home = () => {

  const [sportData, setSportData] = useState([]);
  const [searchkey, setSearchKey] = useState('');

  const [filteredData, setFilteredData] = useState([]);
  const [stakemodedata, setStakeModeData] = useState([]);
  const [stakemode, setStakeMode] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [fixed, setFixed] = useState(0);
  const [percent, setPercent] = useState(0);
  const [max, setMax] = useState(0);

  React.useEffect(() => {
    const run = async () => {
      var [price, sport] = await Promise.all([
        await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getStakeMode?mode=2`),
        await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMornitor?sport=ALL`),
      ])

      setStakeModeData(price.data);
      setSportData(sport.data);
      setFilteredData(sport.data);
    };

    run();
  }, []);

  React.useEffect(() => {
    setFilteredData(!!searchkey ? sportData.filter(el => el.sport.toLowerCase().includes(searchkey.toLowerCase())) : sportData);
  }, [searchkey, sportData]);

  const setModeData = async(mode) => {
    const ret = await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getStakeMode?mode=${mode}`);
    setStakeModeData(ret.data);
    setStakeMode(mode);
  }

  const addPrice = React.useCallback(async () => {
    var data = {};
    var temp = JSON.parse(JSON.stringify(stakemodedata));

    if (stakemode == 2) {
      toast.info('Please select stake mode.');
      return;
    }

    if (to <= from) {
      toast.info('Under value should bigger than Over value.');
      return;
    }

    if ( fixed <= 0) {
      toast.info('Fixed value should bigger than zero.');
      return;
    }

    if ( percent <= 0) {
      toast.info('Percent value should bigger than zero.');
      return;
    }


    for (var x in temp) {
      if (temp[x].from == from && temp[x].to == to && temp[x].mode == stakemode) {
        toast.info('Already added.');
        return;
      }
    }

    data.from = from;
    data.to = to;
    data.mode = stakemode;
    data.fixed = fixed;
    data.percent = percent;
    data.max = max;

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'addStakeMode', {mode:stakemode, from: from, to: to, fixed: fixed, percent:percent, max: max, state: true });
      console.log(result)
      temp.push(data)
      toast.success(`StakeMode( ${from} ~ ${to} ) added.`);
      setStakeModeData(temp);
    } catch (error) {
      toast.error('Adding failed.');
      console.error(error);
      return;
    }

  }, [stakemode, from, to, fixed, percent, max, stakemodedata]);

  const removePrice = async (index) => {
    var temp = JSON.parse(JSON.stringify(stakemodedata));
    var from = temp[index].from;
    var to = temp[index].to;
    var mode = temp[index].mode;
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'removeStakeMode', { from: temp[index].from, to: temp[index].to, mode: temp[index].mode, state: true });
      temp.splice(index, 1);
      toast.success(`Price ( ${from} ~ ${to} ) removed.`);
      setStakeModeData(temp);
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <>
      <div className="h-full">
        <Header />
        <div className="row"></div>
        <div></div>
        <div className="bg-gradient-to-r from-green-600 to-[#233d26] min-h-screen">
          <div className="pt-10 sm:pt-20 m-auto justify-center lg:flex">
            <div className="h-[600px] m-3 sm:w-[440px] sm:m-auto lg:mr-7 sm:mb-3 lg:mb-0 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg sm:p-4">
              <div className="mb-2 text-2xl sm:text-3xl sm:mb-4 font-bold flex justify-center w-full text-purple-900">
                <h1>Sport</h1>
              </div>
              <div className="relative mb-4 sm:mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                  <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="search" id="default-search" className="block w-full p-2 sm:pl-10 sm:py-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search sports..." onChange={(e) => setSearchKey(e.target.value)} required></input>
              </div>
              <div className="h-[490px] sm:h-[440px] overflow-y-auto p-1 sm:p-2 bg-blue-50 rounded-lg">
                {filteredData.map((val, index) => (
                  <SportCard img={`/images/${val.sport}.png`} name={val.sport} _diffmode={val.diffmode} _betmode={val.betmode} _monit={val.monit} _betting={val.betting} _playmode={val.playmode} _market={val.market} count = {index} key={index}/>
                ))}
              </div>
            </div>
            <div className="h-[600px] m-3 sm:w-[440px] sm:m-auto lg:ml-7 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg sm:p-4">
              <div className="mb-2 text-2xl font-bold flex justify-center w-full text-purple-900 sm:mb-4 sm:text-3xl">
                <h1>Stake Mode</h1>
              </div>
              <div className="flex text-base font-bold justify-center space-x-5 mb-2">
                <div className="flex place-items-center">
                  <h1>DiffMode</h1>
                </div>
                <div className="">
                  <select className="cursor-pointer block w-full p-1 overflow-auto text-lg text-center text-white border border-gray-300 rounded-lg bg-blue-600 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setModeData(e.target.value)}>
                    <option className="cursor-pointer" value={0}>Fiexd Mode</option>
                    <option className="cursor-pointer" value={1}>Percent Mode</option>
                    <option className="cursor-pointer" value={2}>All Mode</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="flex justify-center m-auto space-x-8 mb-2">
                  <div className="flex place-items-center text-base font-bold">
                    <h1>Over</h1>
                  </div>
                  <div className="">
                  <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" placeholder={stakemode == 0 ? '0.00$':'0.00%'} onChange={(e) => { setFrom(e.target.value) }} required></input>
                  </div>
                </div>
                <div className="flex justify-center m-auto space-x-5 mb-2">
                  <div className="flex place-items-center text-base font-bold">
                    <h1>Under</h1>
                  </div>
                  <div className="">
                  <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="0" placeholder={stakemode == 0 ? '0.00$':'0.00%'} onChange={(e) => { if (e.target.value < from)
                      e.target.value = from;
                      setTo(e.target.value)}
                    } required></input>
                  </div>
                </div>
              </div>
              <div className="relative flex justify-start pb-4 sm:pb-5">
                <div className="pr-2 sm:pr-4">
                  <div className="mb-1 text-base flex justify-center w-full font-bold">
                    <h1>Fixed</h1>
                  </div>
                  <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0.00$" min="0" onChange={(e) => { setFixed(e.target.value) }} required></input>
                </div>
                <div className="pr-2 sm:pr-4">
                  <div className="mb-1 text-base flex justify-center w-full font-bold">
                    <h1>Percent</h1>
                  </div>
                  <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0.00%" min="0" onChange={(e) => { setPercent(e.target.value) }} required></input>
                </div>
                <div className="pr-2 sm:pr-4">
                  <div className="mb-1 text-base flex justify-center w-full font-bold">
                    <h1>Max</h1>
                  </div>
                  <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0.00$" min="0" onChange={(e) => { setMax(e.target.value) }} required></input>
                </div>
                <div className="flex items-end">
                  <button className="text-white h-10 right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={addPrice}>+</button>
                </div>
              </div>
              <div className="h-[325px] sm:h-[295px] overflow-y-auto bg-blue-50 p-1 sm:p-2 rounded-lg">
                {stakemodedata.map((val, index) => (
                  <div className="p-2 mb-1 sm:mb-2 text-blue-800 rounded-lg text-base bg-orange-400 dark:bg-gray-800 dark:text-blue-400 flex" key={index}>
                    <div className="flex justify-between items-center w-full text-lg font-bold">
                      <div className=" justify-items-center justify-center pl-4">
                        <h1>Diff Range</h1>
                        <h1 className=" text-red-800">{val.from}{val.mode == 0 ? '$': '%'} ~ {val.to}{val.mode == 0 ? '$': '%'}</h1>
                      </div>
                      <div className=" justify-items-center justify-center">
                        <div>
                          <span>Fixed - </span><span className=" text-red-800">{val.fixed}$</span>
                        </div>
                        <div>
                          <span>Percent - </span><span className=" text-red-800">{val.percent}%</span>
                        </div>
                        <div>
                          <span>Max - </span><span className=" text-red-800">{val.max}$</span>
                        </div>
                      </div>
                      <button type="button" className="text-white p-2 bg-blue-700 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 rounded-full" onClick={(e) => removePrice(index)}>
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

export default Home;
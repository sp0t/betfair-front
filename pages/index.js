import { useState } from "react";
import React from "react";
import axios from 'axios'
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "next/image";
import Header from "./../pages/header";
// import Header from "./../component/header";

const SportCard = ({ img = '', name = '', _monit = true, _betting = false, _playmode = false, _market = '0', count = 0}) => {
  const [monit, setMonitState] = useState(_monit);
  const [betting, setBettingState] = useState(_betting);
  const [playmode, setPlaymodeState] = useState(_playmode);
  const [market, setMarketState] = useState(_market);

  const setMonit = async (check) => {
    setMonitState(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setMonit', { sport: name, state: check });

      if (check) toast.success(`Will monit on ${name} matchs.`);
      else toast.success(`Will stop montoring on ${name} matchs.`);
    } catch (error) {
      toast.error(`${name} monit set error.`);
      setMonitState(!check)
      console.error(error);
      return;
    }
  }

  const setBetting = async (check) => {
    console.log('===================>', name, check)
    setBettingState(check)
    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'setBetting', { "sport": name, "state": check });
      console.log(result)

      if (check) toast.success(`Will bet on ${name} matchs.`);
      else toast.success(`Will stop betting on ${name} matchs.`);
    } catch (error) {
      toast.error(`${name} betting set error.`);
      setBettingState(!check)
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
      setPlaymodeState(!check)
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
      setMarketState(!check)
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
      <div className="flex justify-end">
        <div className="flex border border-gray-200 rounded-lg p-1">
          <ul className="flex text-sm font-medium text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="checkbox" value="" name="inplay" checked={playmode} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer" onChange={(e) => setPlayMode(e.target.checked)}></input>
                <label htmlFor="inplay" className="w-full py-1 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">InPlay </label>
              </div>
            </li>
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="checkbox" value="" name="monit" checked={monit} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer" onChange={(e) => setMonit(e.target.checked)}></input>
                <label htmlFor="monit" className="w-full py-1 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">Monit </label>
              </div>
            </li>
            <li className="w-full rounded-t-lg dark:border-gray-600">
              <div className="flex items-center pl-3">
                <input type="checkbox" value="" name="betting" checked={betting} className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 hover:cursor-pointer" onChange={(e) => setBetting(e.target.checked)}></input>
                <label htmlFor="betting" className="w-full py-1 ml-1 text-sm font-medium text-gray-900 dark:text-gray-300">Betting</label>
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
  const [diffmode, setDiffMode] = useState(0);
  const [betmode, setBetMode] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [stake, setStake] = useState(0);
  const [max, setMax] = useState(0);

  React.useEffect(() => {
    const run = async () => {
      console.log('===========================API URL=>', process.env.NEXT_PUBLIC_APIURL);
      var [price, sport] = await Promise.all([
        await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getStakeMode`),
        await axios.get(`${process.env.NEXT_PUBLIC_APIURL}getMonitor?sport=ALL`),
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

 const addPrice = React.useCallback(async () => {
    var data = {};
    var temp = JSON.parse(JSON.stringify(stakemodedata));

    if (to <= from) {
      toast.info('Under value should bigger than Over value.');
      return;
    }

    if ( stake <= 0) {
      toast.info('stake value should bigger than zero.');
      return;
    }

    for (var x in temp) {
      if (temp[x].from == from && temp[x].to == to && temp[x].betmode == betmode && temp[x].diffmode == diffmode) {
        toast.info('Already added.');
        return;
      }
    }

    data.diffmode = diffmode;
    data.betmode = betmode;
    data.from = from;
    data.to = to;
    data.stake = stake;
    data.max = max;

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'addStakeMode', {diffmode:diffmode, betmode:betmode, from: from, to: to, stake: stake, max: max, state: true });
      console.log(result)
      temp.push(data)
      toast.success(`StakeMode( ${from} ~ ${to} ) added.`);
      setStakeModeData(temp);
    } catch (error) {
      toast.error('Adding failed.');
      console.error(error);
      return;
    }

  }, [diffmode, betmode, from, to, stake, max, stakemodedata]);

  const devideString = (data) => {
    const val = data.split("-");
    const extracted = val[0].trim();
    return extracted;
  }

  const removePrice = async (index) => {
    var temp = JSON.parse(JSON.stringify(stakemodedata));
    var from = temp[index].from;
    var to = temp[index].to;

    try {
      const result = await axios.post(process.env.NEXT_PUBLIC_APIURL + 'removeStakeMode', {diffmode: temp[index].diffmode, betmode: temp[index].betmode, stake:temp[index].stake, from: temp[index].from, to: temp[index].to, state: true });
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
                  <SportCard img={`/images/${devideString(val.sport)}.png`} name={val.sport} _monit={val.monit} _betting={val.betting} _playmode={val.playmode} _market={val.market} count = {index} key={index}/>
                ))}
              </div>
            </div>
            <div className="h-[600px] m-3 sm:w-[440px] sm:m-auto lg:ml-7 border-solid border-rose-600 bg-orange-600 p-2 rounded-lg sm:p-4">
              <div className="mb-2 text-2xl font-bold flex justify-center w-full text-purple-900 sm:mb-4 sm:text-3xl">
                <h1>Stake Mode</h1>
              </div>
              <div className="flex space-x-2 px-2 mb-2">
                <h1 className="mr-3 mt-1">Diff</h1>
                <select className="cursor-pointer block w-18 p-1 overflow-auto text-sm text-center bg-orange-500 text-black border rounded-md" onChange={(e) => setDiffMode(e.target.value)}>
                  <option className="cursor-pointer" value={0}>Fiexd</option>
                  <option className="cursor-pointer" value={1}>Percent</option>
                </select>
                <input type="number" className="text-sm w-16 text-center bg-white text-black border rounded-md" min="0" required onChange={(e) => setFrom(e.target.value)}></input>
                <h1 className="px-3.5">~</h1>
                <input type="number" className="text-sm w-16 text-center bg-white text-black border rounded-md" min="0" required onChange={(e) => setTo(e.target.value)}></input>
                <h1 className=""></h1>
              </div>
              <div className="flex space-x-2 px-2 mb-4">
                <h1 className="mt-1">Stake</h1>
                <select className="cursor-pointer block w-18 p-1 overflow-auto text-sm text-center bg-orange-500 text-black border rounded-md " onChange={(e) => setBetMode(e.target.value)}>
                  <option className="cursor-pointer" value={0}>Fiexd</option>
                  <option className="cursor-pointer" value={1}>Percent</option>
                </select>
                <div className="flex">
                  <input type="number" className="text-sm w-16 text-center bg-white text-black border rounded-md" min="0" required onChange={(e) => setStake(e.target.value)}></input>
                </div>
                <h1 className=""></h1>
                <h1 className="mr-2">Max</h1>
                <div className="flex">
                  <input type="number" className="py-1 text-sm w-16 text-center bg-white text-black border rounded-md" min="0" required onChange={(e) => setMax(e.target.value)}></input>
                </div>
                <h1 className="">($)</h1>
                <div className="flex items-end mb-0.5">
                  <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1" onClick={() => addPrice()}>+</button>
                </div>
              </div>
              <div className="h-[460px] sm:h-[430px] overflow-y-auto bg-blue-50 p-1 sm:p-2 rounded-lg">
                {stakemodedata.map((val, index) => (
                  <div className="p-2 mb-1 sm:mb-2 text-blue-800 rounded-lg text-base bg-orange-400 dark:bg-gray-800 dark:text-blue-400 flex" key={index}>
                    <div className="flex justify-between items-center w-full text-md font-bold">
                      <div className="flex text-center">
                        <div className="w-20 text-end">{val.diffmode == 0 ? 'Fixed:':'Percent:'}</div>
                        <h1 className="pl-1">{val.diffmode == 0 ? `${val.from} `: `${val.from}`}</h1>
                        <h1>~</h1>
                        <h1>{val.diffmode == 0 ? `${val.to} `: `${val.to}`}</h1>
                      </div>
                      <div className="flex text-center">
                        <div>Stake:</div>
                        <h1 className="pl-1">{val.betmode == 0 ? `$${val.stake}`: `${val.stake}%`}</h1>
                      </div>
                      <div className="flex text-center">
                        <div>Max:</div>
                        <h1 className="pl-1">{`$${val.max}`}</h1>
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
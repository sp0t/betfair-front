import Link from "next/link"
export const Header = () => {
    return(
      <div className='h-20 bg-slate-800'>
        <div className='flex justify-between pl-24 pt-6 h-full'>
          <div className='text-rose-600 text-4xl font-bold'>
            <h1>Betfair-bot</h1>
          </div>
          <div className='flex pr-20 text-white hover:font-bold text-2xl'>
            <div className="p-3">
              <Link href="/">
                <h2>Home</h2>
              </Link>
            </div>
            <div className="p-3">
              <Link href="/setting">
                <h2>Setting</h2>
              </Link>
            </div>
            {/* <div className="p-3">
              <Link href="/setting">
                <h2>Authentication</h2>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    )
  }

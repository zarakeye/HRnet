import logo from '../../assets/WealthHealth_Logo.png';

function Header (): JSX.Element {
  return (
    <header className='flex items-center '>
      <figure className='flex flex-col items-center justify-center'>
        <img src={logo} alt="WealthHealth Logo" className='h-28' />
        <figcaption className='font-bold text-[#5B7006]'>
          <span className='font-league-spartan-500 text-[20px]'>W</span><span className='font-league-spartan-500 text-[15px]'>EALTH</span><span className='font-league-spartan-500 text-[20px]'>H</span><span className='font-league-spartan-500 text-[15px]'>EALTH</span>
        </figcaption>
      </figure>
      <h1 className='text-emerald-700 text-3xl py-[25px] pl-[20px]'>
        <span className='text-white text-8xl bg-[#105924] inline-block p-[10px] border-2 border-[#105924]'>HRnet</span>
      </h1>
    </header>
  )
}

export default Header
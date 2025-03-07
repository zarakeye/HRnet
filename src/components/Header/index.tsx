import { useNavigate } from 'react-router-dom';
import logo from '../../assets/WealthHealth_Logo.png';

function Header (): JSX.Element {
  const navigate = useNavigate();
  return (
    <header className='w-full fixed flex flex-row flex-1 items-baseline justify-center bg-white py-[20px] pl-[20px] z-10'>
      <figure className='flex flex-col items-center justify-center bg-white p-[10px]'>
        <img src={logo} alt="WealthHealth Logo" className='h-28 cursor-pointer' onClick={() => navigate('/')} />
        <figcaption className='font-bold text-[#5B7006]'>
          <span className='font-league-spartan-500 text-[20px]'>W</span>
          <span className='font-league-spartan-500 text-[15px]'>EALTH</span>
          <span className='font-league-spartan-500 text-[20px]'>H</span>
          <span className='font-league-spartan-500 text-[15px]'>EALTH</span>
        </figcaption>
      </figure>
      <h1 className='text-emerald-700 text-3xl py-[25px] pl-[20px] cursor-pointer' onClick={() => navigate('/')}>
        <span className='text-[#105924] text-8xl  inline-block p-[10px]'>HRnet</span>
      </h1>
      <div className='absolute bottom-0 left-0 w-full h-4 bg-[#105924] bg-gradient-to-t from-white to-transparent backdrop-blur-lg'></div>
    </header>
  )
}

export default Header
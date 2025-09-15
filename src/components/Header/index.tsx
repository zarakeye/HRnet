import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.webp';
import logoutIcon from '../../assets/logout.svg';
import { useAuthStore } from '../../app/hooks/useAuthStore';

/**
 * A React component that renders a header with the WealthHealth logo and the title "HRnet".
 * The logo is clickable and navigates to the homepage.
 * The title is also clickable and navigates to the homepage.
 */
function Header (): JSX.Element {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  return (
    <header className='w-full fixed flex flex-row justify-between items-end flex-1 bg-transparent backdrop-blur-md py-[20px] pl-[20px] z-10'>
      {/* <div> */}
        <div className='flex flex-row'>
          <figure className='flex flex-col items-center justify-center bg-white mr-[20px]'>
            <img src={logo} alt="WealthHealth Logo" className='h-[70px] w-[70.67px] cursor-pointer' onClick={() => navigate('/')} />
            <figcaption className='font-bold text-[#5B7006]'>
              <span className='font-league-spartan-500 text-[15px]'>W</span>
              <span className='font-league-spartan-500 text-[10px]'>EALTH</span>
              <span className='font-league-spartan-500 text-[15px]'>H</span>
              <span className='font-league-spartan-500 text-[10px]'>EALTH</span>
            </figcaption>
          </figure>
          <h1 className='font-varela-round text-[#0f3a1b] text-6xl inline-block cursor-pointer' onClick={() => navigate('/')}>
            <span className='text-8xl'>HR</span>net
          </h1>
        </div>
        <div>
          <img src={logoutIcon} alt="Logout" className='h-[70px] w-[70.67px] cursor-pointer' onClick={() => logout()} />
        </div>
      {/* </div> */}
    </header>
  )
}

export default Header
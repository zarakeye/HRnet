import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home';
import CreateEmployee from '../pages/CreateEmployee';
import Profile from '../pages/Profile';
import '@ant-design/v5-patch-for-react-19';
import UpdateNotification from '../components/UpdateNotification';

/**
 * The main App component that renders the routes for the application.
 * It renders three routes: '/', '/create-employee', and '/profile/:id'.
 * The '/' route renders the Home component.
 * The '/create-employee' route renders the CreateEmployee component.
 * The '/profile/:id' route renders the Profile component.
 * The App component also renders the UpdateNotification component.
 */
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/create-employee' element={<CreateEmployee />} />
        <Route path='/profile/:id' element={<Profile />} />
      </Routes>
      <UpdateNotification />
    </>
  )
}

export default App

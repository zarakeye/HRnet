import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home';
import CreateEmployee from '../pages/CreateEmployee';
import Profile from '../pages/Profile';
import '@ant-design/v5-patch-for-react-19';
import UpdateNotification from '../components/updateNotification';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/create-employee' element={<CreateEmployee />} />
      <Route path='/profile/:id' element={<Profile />} />
      <UpdateNotification />
    </Routes>
  )
}

export default App

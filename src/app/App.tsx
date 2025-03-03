import { Routes, Route } from 'react-router-dom'
// import './App.css'
import Home from '../pages/Home';
import CreateEmployee from '../pages/CreateEmployee';
import UpdateEmployee from '../pages/UpdateEmployee';
import Profile from '../pages/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/create-employee' element={<CreateEmployee />} />
      <Route path='/profile/:id' element={<Profile />} />
      <Route path='/update-employee/:id' element={<UpdateEmployee />} />
    </Routes>
  )
}

export default App

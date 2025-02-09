import { Routes, Route } from 'react-router-dom'
// import './App.css'
import Home from '../pages/Home';
import UpdateEmployee from '../pages/UpdateEmployee';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/update-employee/:id' element={<UpdateEmployee />} />
    </Routes>
  )
}

export default App

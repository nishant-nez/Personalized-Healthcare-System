import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Activate from './pages/Activate'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import ResetPasswordConfirm from './pages/ResetPasswordConfirm'
import Signup from './pages/Signup'
import Hospitals from './pages/Hospitals'

import Layout from './hocs/Layout'


const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/hospitals' element={<Hospitals />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />} />
        <Route path='/activate/:uid/:token' element={<Activate />} />
      </Routes>
    </Layout>
  </Router>
)

export default App
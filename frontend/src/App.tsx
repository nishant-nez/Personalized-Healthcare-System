import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Activate from './pages/auth/Activate'
import Login from './pages/auth/Login'
import ResetPassword from './pages/auth/ResetPassword'
import ResetPasswordConfirm from './pages/auth/ResetPasswordConfirm'
import Signup from './pages/auth/Signup'
import Hospitals from './pages/Hospitals'
import History from './pages/History'
import NotFound from './pages/NotFound'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import MyBlogs from './pages/MyBlogs'
import MedicineReminders from './pages/MedicineReminders'
import Profile from './pages/Profile'
import RequireAuth from './components/RequireAuth'

import Layout from './hocs/Layout'


const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/hospitals' element={<Hospitals />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/blogs/:id' element={<BlogDetail />} />

        <Route element={<RequireAuth />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/history' element={<History />} />
          <Route path='/reminders' element={<MedicineReminders />} />
          <Route path='/profile/blogs' element={<MyBlogs />} />
        </Route>

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />} />
        <Route path='/activate/:uid/:token' element={<Activate />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  </Router>
)

export default App
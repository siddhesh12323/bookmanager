import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ShowBook from './pages/ShowBook'
import Home from './pages/Home'
import CreateBooks from './pages/CreateBooks'
import EditBook from './pages/EditBook'
import DeleteBook from './pages/DeleteBook'
import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import Signup from './pages/Signup'

const App = () => {
  return (
    <Routes>
      <Route path='/books/delete/:id' element={ <DeleteBook/> }></Route>
      <Route path='/books' element={ <Home/> }></Route>
      <Route path='/books/details/:id' element={ <ShowBook/> }></Route>
      <Route path='/books/create' element={ <CreateBooks/> }></Route>
      <Route path='/books/edit/:id' element={ <EditBook/> }></Route>
      <Route path='/' element={ <Onboarding/> }></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/signup' element={<Signup />}></Route>
    </Routes>
  )
}

export default App

import "./App.css";
import React from "react";
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import Home from "./components/Home";


const  App = () => {

  return (    
   <BrowserRouter>
     <Routes>
      <Route exact path='/' element={ <Home /> } />
      <Route path='/login' element={ <Login />} />
      <Route path='/register' element={ <Login />} />

     </Routes>   
   </BrowserRouter>

  );
}

export default App;

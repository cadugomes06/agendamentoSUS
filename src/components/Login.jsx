import axios from 'axios';
import React, { useState} from "react";
import styles from '../components/Header.module.css'

const Header = () => {
const [ values, setValues ] = useState()
const [ login, setLogin ] = useState(true)

const handleChangeValues = (value) => {
  setValues((prevValue) => ({
    ...prevValue, [value.target.name]: value.target.value,
  }))
}

 const handleRegisterBtn = () => {

  if(login === false) {
  axios.post("http://localhost:3000/auth/register", {
    name: values.name,
    email: values.email,
    password: values.password,
    confirmPassword: values.confirmPassword
  }).then((res) => {
    console.log(res)
    if(res.status !== 201) {
      console.log("Conta criada com sucesso")
      setLogin(true)
    }
  }).catch((error) => {
    window.alert(error.response.request.response)
  })
} 

if (login === true) {
  axios.post("http://localhost:3000/auth/login", {
    email: values.email,
    password: values.password,
  }).then((res) => {
    console.log(res)
    if(res.status === 200) {
      window.alert("Login realizado com sucesso")
      setLogin(true)
    }   
  }).catch((error) => {
    window.alert(error.response.request.response)
  })
}
}


return (
  <div className={styles.registerContainer}>

    <section className={styles.sectionRegister}>
      <div className={styles.secLogin}>
        <button 
        onClick={(event) =>  setLogin(!login)} className={login ? styles.btn1 : styles.btn2}>
          {login } Login
        </button> 
        <button 
        onClick={(event) => setLogin(!login)} className={login ? styles.btn2 : styles.btn1}>
          {login } Registrar
        </button>   
      </div>

      <label className={login ? styles.sectionOff : ''}>Nome</label>
      <input 
        className={login ? styles.sectionOff : ''}
        type="text"
        name="name" 
        onChange={handleChangeValues}/>

       <label>Email</label>
      <input 
        type="email"
        name="email" 
        onChange={handleChangeValues}/> 
        

      <label>Senha</label>
      <input 
        type='password'
        name='password'
        onChange={handleChangeValues}
        />

        
      <label className={login ? styles.sectionOff : ''}>Confirmar senha</label>
      <input 
        className={login ? styles.sectionOff : ''}
        type='password'
        name='confirmPassword'
        onChange={handleChangeValues}
        />         

        <button className={styles.btn1} onClick={handleRegisterBtn}>{login ? 'Logar' : 'Registrar'}</button>
    </section>
  </div>
  )
}

export default Header
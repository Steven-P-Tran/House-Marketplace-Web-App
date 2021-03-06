import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { db } from '../firebase.config'
import {setDoc, doc, serverTimestamp} from 'firebase/firestore'
import OAuth from '../components/OAuth'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'


function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const {name, email, password} = formData // destructures the email and password for later use

  const onChange = (e) => { // will allow the user to update the text bars with data
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  
  }

  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()


    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      updateProfile(auth.currentUser, {displayName: name})

      const formDataCopy = {...formData} // copying everything in the formData state, which is the name, email password
      delete formDataCopy.password // deleting password from database for security purposes
      formDataCopy.timestamp = serverTimestamp() // sets timestamp of user data

      await setDoc(doc(db, 'users', user.uid), formDataCopy) // updates the database and users to the 'users' collection


      navigate('/')

    } catch (error) {
      toast.error('Something went wrong with registration')
    }

  }


  return (
    <>
     <div className="PageContainer">
      <header>
        <p className="pageHeader">Welcome Back!</p>
      </header>

      <form onSubmit={onSubmit}>
      <input 
        type="text" 
        className="nameInput" 
        placeholder='Name' 
        id='name' 
        value={name} 
        onChange={onChange}
        />

        <input 
        type="email" 
        className="emailInput" 
        placeholder='Email' 
        id='email' 
        value={email} 
        onChange={onChange}
        />

            <div className="passwordInputDiv">
            <input 
            type={showPassword ? 'text' : 'password'} 
            className='passwordInput' 
            placeholder='Password' 
            id='password' 
            value={password} 
            onChange={onChange}
            />
          
          <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() =>
          setShowPassword((prevState) => !prevState)}/> 
          </div>
            <Link to='/forgot-password' className='forgotPasswordLink'>
              Forgot Password
            </Link>

            <div className="signUpBar">
              <p className="signUpText">
                Sign Up
              </p>
              <button className="signUpButton">
                <ArrowRightIcon fill='white' width='40px' height='40px' /> 
              </button>
            </div>
        </form>

        <OAuth />

        <Link to='/sign-in' className='registerLink'>
          Sign In Instead
        </Link>
     </div>
    </>
  )
}
  
  export default SignUp
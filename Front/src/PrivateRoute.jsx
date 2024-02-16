import { useContext } from "react"
import { ModalContext } from "./Context/ModalsContext"
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({children}) => {
    const {isUserLoggedIn} = useContext(ModalContext)
  return (
    <div>{isUserLoggedIn ? children : <Navigate to='/'/>}</div>
  )
}

export default PrivateRoute;
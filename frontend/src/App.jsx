import { createContext, useEffect, useReducer } from 'react';
import './App.css';
import Checkout from './Components/PaymentPage/Checkout';
let userContext = createContext()
let initialState = {
  user: true,
  username: null,
}
function reducer(state, action) {
  if (action.type === "LOGIN") {
    return ({
      user: true,
      username: action.username
    })
  } else if (action.type === "LOGOUT") {
    return ({
      user: false,
      username: null
    })
  }
}

function App() {
  let [state, dispatch] = useReducer(reducer, initialState)
  async function authenticateuser() {
    try {
      let response = await fetch('/authenticateuser', {
        method: "POST",
        headers: {
          "Content-Type": "Application/json"
        }
      })
      if (response.status === 200) {
        console.log("logged in");
        let result = await response.json()
        dispatch({ type: "LOGIN", username: result.username })
      }
      else {
        dispatch({ type: "LOGOUT" })
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    authenticateuser()
  }, [])
  return (
    <><userContext.Provider value={{ state, dispatch }}>
      <Checkout />
    </userContext.Provider>
    </>
  );
}

export default App;
export { userContext };
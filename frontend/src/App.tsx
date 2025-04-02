import { Home } from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { StartMatch } from './pages/StartMatch';
import store from './store';
import { ProtectedRoutes } from './utils/ProtectedRoutes';


function App() {

  return (
    <Provider store={store}>
       <Router>
        <Routes>
          <Route element={ <ProtectedRoutes /> }>
            <Route path="/home" element={<Home />} />
          </ Route>
          <Route path="/" element={<StartMatch />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App

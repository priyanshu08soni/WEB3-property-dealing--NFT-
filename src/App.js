
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';


function App() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          {/* By help of outlet we will using multiple routes in layout. */}
          <Route
            index
            element={
              <LandingPage />
            }
          />
          <Route
            exact path="/properties"
            element={<LandingPage />}
          />
        </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;

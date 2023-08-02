import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { setMiniSidenav, useMaterialUIController } from "context";
import { useEffect, useState } from "react";

import Basic from "screens/autenticacion";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "examples/Sidenav";
import { ThemeProvider } from "@mui/material/styles";
import { auth } from "contants/Firebase";
import brandDark from "assets/images/logo-ct-dark.png";
import brandWhite from "assets/images/logo-ct.png";
import routes from "routes";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";

export default function App() {
  const history = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();


  useEffect(()=>{
    const checkFirebaseAuth = () => {
      const unsubscribe = auth.onAuthStateChanged( async(user) => {

          if (!user) {
              history(`./authentication/sign-in`);
          }else{
            history(`./dashboard`);
            
          }
      });
      
      return () => unsubscribe();
      };
      
      checkFirebaseAuth();
  },[])
  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Feriaropa"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
        </>
      )}
      <Routes>
        {getRoutes(routes)}
        <Route path={'/authentication/sign-in'} element={<Basic />} />
        <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
      </Routes>
    </ThemeProvider>
  );
}

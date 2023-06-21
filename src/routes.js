import Administradores from "screens/administradores";
import Billing from "layouts/billing";
import Categorias from "screens/categorias";
import Dashboard from "layouts/dashboard";
import Icon from "@mui/material/Icon";
import Notifications from "layouts/notifications";
import Productos from "screens/productos";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Tables from "layouts/tables";
import Usuarios from "screens/usuarios";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Administradores",
    key: "administradores",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/administradores",
    component: <Administradores />,
  },
  {
    type: "collapse",
    name: "Usuarios",
    key: "usuarios",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/usuarios",
    component: <Usuarios />,
  },
  {
    type: "collapse",
    name: "Productos",
    key: "productos",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/productos",
    component: <Productos />,
  },
  {
    type: "collapse",
    name: "Categorias",
    key: "categorias",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/categorias",
    component: <Categorias />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  }, 
];

export default routes;

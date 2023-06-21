import Administradores from "screens/administradores";
import Basic from "screens/autenticacion";
import Categorias from "screens/categorias";
import Dashboard from "layouts/dashboard";
import Icon from "@mui/material/Icon";
import Logout from "screens/autenticacion/Logout";
import Productos from "screens/productos";
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
    name: "Sign Out",
    key: "sign-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/logout",
    component: <Logout />,
  }
];

export default routes;

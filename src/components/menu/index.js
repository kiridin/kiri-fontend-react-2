import "./index.css";
import { Link, useLocation } from "react-router-dom";
import usuarioService from "../../services/user-service";
import LogoutIcon from '@mui/icons-material/Logout';


export default function Menu(){
    const logout = () => {
        usuarioService.sairDoSistema();
    };

    if(useLocation().pathname !== "/login"){
        return(
            <ul className="menu">
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/produtos'>Produtos</Link></li>
                <li><Link to='/backup'>Backup</Link></li>
                <li><Link onClick={logout}><LogoutIcon /></Link></li>
            </ul>
        )
    }else{
        return null; // Retorno nada par ao compoenten renderizar no DOM.
    }

}
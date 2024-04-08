import Home from "./pages/home";
import Produtos from "./pages/produtos";
import Login from "./pages/login";
import Backup from "./pages/backup";


import Menu from "./components/menu";

import { BrowserRouter, Routes, Route } from 'react-router-dom'
export default function Router(){
    return (
        <BrowserRouter>
            {/* aqui poderia ter por exemplo um menu personalizado...  */}
            <Menu/>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/backup" element={<Backup/>} />
            </Routes>
        </BrowserRouter>
    )
};
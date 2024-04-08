import React, { useState } from "react";
import "./index.css"; 
import usuarioService from "../../services/user-service";
import Swal from "sweetalert2";
import { TextField, IconButton, Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const navigate = useNavigate(); 

  const toggleShowSenha = () => {
    setShowSenha(!showSenha);
  };

  const autenticar = () => {
    if (!email || !senha) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Os campos de e-mail e senha são obrigatórios, verifique!'
      });
      return;
    }


    usuarioService.autenticar(email, senha)
      .then(response => {
        usuarioService.salvarToken(response.data.token);
        usuarioService.salvarUsuario(response.data.usuario);
        navigate('/'); // Usar navigate ao invés de window.location
      })
      .catch(erro => {
        Swal.fire({
          icon: 'error',
          title: 'Falha na autenticação',
          text: 'Verifique seu usuário e senha e tente novamente.'
        });
      });
  };

  return (
    <div className="login-container">
      <h2 id="titulo">Login</h2>
      
      <TextField
        id="email"
        label="Usuário"
        variant="standard"
        value={email}
        autoComplete="off"
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{ style: { color: 'white' } }} 
        InputLabelProps={{'style': {'color':'white'}}}   />
      <br/><br/>

      <TextField
        id="senha"
        label="Senha"
        variant="standard"
        type={showSenha ? 'text' : 'password'}
        value={senha}
        autoComplete="off"
        onChange={(e) => setSenha(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton onClick={toggleShowSenha} edge="end">
              {showSenha ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
        style={{ width: '200px' }}
      
        InputProps={{ style: { color: 'white' } }} 
        InputLabelProps={{'style': {'color':'white'}}}
      />
      <br/><br/>
      
      <Button variant="contained" onClick={autenticar}>Entrar</Button>
    </div>
  );
}

export default Login;

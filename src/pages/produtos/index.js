import "./index.css";
import produtoService from "../../services/produto-service";
import Swal from "sweetalert2";
import Produto from "../../models/Produto";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

// HOOKs
import { useState, useEffect } from 'react'


export default function Produtos() {

    const [produtos, setProdutos] = useState([]);
    const [produto, setProduto] = useState(new Produto());
    const [modoEdicao, setModoEdicao] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [ordem, setOrdem] = useState({ campo: '', direcao: '' });

    // Vai executar toda vez que a tela for carrergada
    useEffect(() => {
        produtoService.obter()
            .then((response) => {
                setProdutos(response.data);
            })
            .catch(erro => { })
    }, []);
    const filteredProdutos = produtos.filter(produto => {
        const nomeMatch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
        
        const idMatch = produto.id.toString().includes(searchTerm.toLowerCase());
    
       
        return nomeMatch || idMatch;
    });
    
 

    const editar = (e) => {
        setModoEdicao(true);
        let produtoParaEditar = produtos.find(c => c.id == e.target.id);
        produtoParaEditar.dataCadastro = produtoParaEditar.dataCadastro.substring(0, 10);

        setProduto(produtoParaEditar);
    }
    

    const excluirProdutoNaLista = (produto) => {
        let indice = produtos.findIndex(c => c.id == produto.id);

        produtos.splice(indice, 1);

        setProdutos(arr => [...arr]);
    }

    const excluir = (e) => {
        let produtoParaExcluir = produtos.find(p => p.id == e.target.id);

        // eslint-disable-next-line no-restricted-globals
        if (produtoParaExcluir) {
            Swal.fire({
                icon: 'warning',
                text: `Deseja realmente excluir o produto ${produtoParaExcluir.nome}?`,
                showCancelButton: true,
                confirmButtonText: 'Sim',
                confirmButtonColor:"red",
                cancelButtonText: 'Cancelar',
         
            }).then((result) => {
                if (result.isConfirmed) {
                    produtoService.excluir(produtoParaExcluir.id)
                    excluirProdutoNaLista(produtoParaExcluir);
                }
            });
        }
    };

    const salvar = () => {
        if (!produto.nome || !produto.valor ||  !produto.quantidadeEstoque || !produto.dataCadastro) {
            Swal.fire({
                icon: 'error',
                text: 'Nome, valor, quantidade e data são obrigatórios.'
            });

            return;
        }

        (modoEdicao)
            ? atualizarProdutoNoBackend(produto)
            : adicionarProdutoNoBackend(produto);
    }


    const atualizarProdutoNoBackend = (produto) => {
        produtoService.atualizar(produto)
        .then(response => {
            limparModal();

            Swal.fire({
                icon: 'success',
                title: `Produto ${produto.nome}, foi atualizado com sucesso!`,
                showConfirmButton: false,
                timer: 3000
            })

            let indice = produtos.findIndex(c => c.id == produto.id);
            produtos.splice(indice, 1, produto);

            setProdutos(lista => [...lista]);

        })
    }

    const adicionar = () => {
        setModoEdicao(false);
        limparModal();
    }

    const limparModal = () => {
         // Limpar modal de cliente com react
         setProduto({
            ...produto,
            id: '',
            nome: '',
            valor: '',
            quantidadeEstoque: '',
            dataCadastro: '',
            observacao: ''
        });
    }

    const adicionarProdutoNoBackend = (produto) => {
        produtoService.adicionar(produto)
            .then(response => {
                setProdutos(lista => [...lista, new Produto(response.data)]);

               limparModal();

                Swal.fire({
                    icon: 'success',
                    title: `Produto ${produto.nome}, foi cadastrado com sucesso!`,
                    showConfirmButton: false,
                    timer: 3000
                })
            })
    }

    return (
        <div className="container">
            <SearchIcon
             style={{ position: "absolute",  marginTop: "122px", left: "1350px", fontSize:"75px", color:"black"  }}/>
                  <TextField 
                    id="filled-basic" label="Pesquisar" variant="filled"
                    style={{ backgroundColor:"rgba(0, 0, 0, 0.671)", position: "fixed",  marginTop: "142px", left: "79.5%", width: "200px"  }}  
    type="text" 
    className="" 
    onChange={(e) => setSearchTerm(e.target.value)}
    InputProps={{ style: { color: 'white' } }} 
    InputLabelProps={{'style': {'color':'white'}}}
/>

            {/* Titulo */}
            <div className="row">
                <div className="col-sm-12">
                    <h4 style={{   zIndex:"10", position: "fixed", top:"50px", color: 'black', textDecoration: 'underline', fontSize: "60px" }}>Produtos</h4>
                    <hr />
                </div>
            </div>

            {/* Botão para adicionar */}
            <div className="row">
                <div className="col-sm-3">
                    <button style={{ zIndex:"10",position: "fixed", top:"150px", scale: "1.5", marginLeft:"25px" }}   onClick={adicionar} id="btn-adicionar" className="btn-adicionar " data-bs-toggle="modal"
                        data-bs-target="#modal-produto"><AddShoppingCartIcon/>Adicionar</button>
                </div>
            </div>
{/* linha */}
<div className="linha"></div>
            {/* Tabela */}
            <div className="row mt-3">
            <div className="col-sm-12 table-container">
                    <table style={{ boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.5)",  zIndex:"1" ,overflow: "scroll", height:'0px', position:  "relative", marginTop:"150px"}} className="table table-striped table-bordered table-hover table-dark">
                    <thead className="custom-thead">                            <tr  >
                                <th style={{  backgroundColor:"black" }} >ㅤId</th>
                                <th style={{  backgroundColor:"black" }}>ㅤNome </th>
                                <th style={{ backgroundColor: "black" }}>ㅤValor</th>
                                <th style={{ backgroundColor: "black" }}>Estoque</th>
                                <th style={{  backgroundColor:"black" }}>ㅤObservações</th>
                                <th style={{  backgroundColor:"black" }}>ㅤData de cadastro</th>
                                <th style={{  backgroundColor:"black" }}>ﾠㅤEditar</th>
                                <th style={{  backgroundColor:"black" }}>ㅤExcluir</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredProdutos.map(produto => (
                                <tr>
                                    <td>ㅤ{produto.id}</td>
                                    <td>ㅤ{produto.nome}</td>
                                    <td>ㅤ{produto.valor}</td>
                                    <td>ㅤ{produto.quantidadeEstoque}</td>
                                    <td>ㅤ{produto.observacao}</td>
                                    <td>ㅤ{new Date(produto.dataCadastro).toLocaleDateString()}</td>
                                    <td className="col-sm-1">
                                       
                                       
                                       
                                       
                                       
                                       
                                        <button id={produto.id} style={{ color: 'green' }} onClick={editar} className="btn btn-outline-primary btn-sm mr-3" data-bs-toggle="modal"
                                            data-bs-target="#modal-produto">
                                            <EditIcon style={{ pointerEvents: "none"}}/>
                                        </button>
                                        </td>
                                        <td className="col-sm-1">
                                        <button id={produto.id} style={{ color: 'red' }} onClick={excluir} className="btn btn-outline-primary btn-sm mr-3">
                                            <DeleteIcon style={{ pointerEvents: "none"}}/>
                                        </button>
                                        </td>                                 
                                                                                    
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* The Modal */}
            <div className="modal" id="modal-produto">
                <div className="modal-dialog">
                    <div className="modal-content">

                        {/* Modal Header */}
                        <div className="modal-header">
                            <h1 style={{ textDecoration: 'underline' }} className="modal-title">{modoEdicao ? 'Editar produto' : 'Adicionar produto'}</h1>
                        </div>

                        {/* Modal body */}
                        <div className="modal-body">

                            <div className="row">

                                <div className="col-sm-2">
                                    <label style={{ textDecoration: 'underline' }} for="id" className="form-label"><h5>Id:</h5></label>
                                    <input
                                        id="id"
                                        style={{ textDecoration: 'underline' }}
                                        type="text"
                                        disabled
                                        className="form-control"
                                        value={produto.id}
                                        onChange={(e) => setProduto({ ...produto, id: e.target.value })}
                                    />
                                </div>

                                <div className="col-sm-8">
                                    <label for="nome" style={{ textDecoration: 'underline' }} className="form-label"><h5>Nome:</h5></label>
                                    <input id="nome" type="text" className="form-control"
                                    autoComplete="off"
                                        value={produto.nome}
                                        onChange={(e) => setProduto({ ...produto, nome: e.target.value })} />
                                </div>
                            </div>

                            <div className="row">

                                <div className="col-sm-2">
                                    <label for="valor" style={{ textDecoration: 'underline' }} className="form-label"><h5>Valor:</h5></label>
                                    <input id="valor" type="number"  min={0} className="form-control"
                                        value={produto.valor}
                                        onChange={(e) => setProduto({ ...produto, valor: e.target.value })} />
                                </div>

                                <div className="col-sm-2">
                                    <label for="estoque"  style={{ textDecoration: 'underline' }} className="form-label"><h5>Estoque</h5></label>
                                    <input id="estoque" type="number" min={0} className="form-control"
                                        value={produto.quantidadeEstoque}
                                        onChange={(e) => setProduto({ ...produto, quantidadeEstoque: e.target.value })} />
                                </div>

                                <div className="col-sm-3">
                                    <label for="obs"  style={{ textDecoration: 'underline' }} className="form-label"><h5>Observações</h5></label>
                                    <input id="obs" type="text" className="form-control" maxlength="30"
                                        value={produto.observacao}
                                        autoComplete="off"
                                        onChange={(e) => setProduto({ ...produto, observacao: e.target.value })} />
                                </div>

                                <div className="col-sm-3">
                                    <label for="dataCadastro"  style={{ textDecoration: 'underline' }} className="form-label"><h5>Cadastro:</h5></label>
                                    <input id="dataCadastro" type="date" className="form-control"
                                        value={produto.dataCadastro}
                                        onChange={(e) => setProduto({ ...produto, dataCadastro: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="modal-footer">
                            <button style={{ backgroundColor: 'black'}} onClick={salvar} id="btn-salvar" type="button" className="btn btn-primary btn-sm">Salvar</button>
                            <button id="btn-cancelar" type="button" className="btn btn-light btn-sm" data-bs-dismiss="modal">Cancelar</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
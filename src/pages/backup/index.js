import React, { useState } from 'react';
import "./index.css";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { Modal, Button } from 'react-bootstrap';
import { obter } from  "../../services/backup-service";
import { apagarTudo } from  "../../services/backup-service";
import { adicionar } from  "../../services/backup-service";
import ReactDOM from 'react-dom'; // Import ReactDOM

const Backup = () => {
    // Estados para controlar os modais
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showBackupModal, setShowBackupModal] = useState(false);

    // Função para lidar com o clique no botão de restaurar backup
    const handleRestoreClick = () => {
        setShowRestoreModal(true);
    };

    // Função para lidar com a confirmação de restauração
    const handleRestoreConfirm = async () => {
        try {
            const input = document.createElement('input');
            input.type = 'file';

            input.onchange = async (event) => {
                const file = event.target.files[0];

                const keepCurrentData = await showConfirmModal("Deseja manter os dados atuais?");

                if (!keepCurrentData) {
                   
                    await apagarTudo();
                    
                }

                const reader = new FileReader();
                reader.readAsText(file);

                reader.onload = async (event) => {
                    try {
                        const data = JSON.parse(event.target.result);

                        for (let item of data) {
                            const { id, ...body } = item;
                            await adicionar(body);
                        }
                        showSuccessModal("Restauração concluída com sucesso!");
                        setShowRestoreModal(false); // Fecha o modal após a restauração
                    } catch (error) {
                        console.error("Erro ao processar o arquivo de backup:", error);
                    }
                };

                reader.onerror = (error) => {
                    console.error("Erro ao ler o arquivo de backup:", error);
                };
            };

            input.click();
        } catch (error) {
            console.error('Erro ao restaurar o backup:', error);
        }
    };

    const handleBackupDownload = async () => {
        try {
            const response = await obter();
            
            if (response && response.data) {
                const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `backup ${new Date().getDate().toString().padStart(2, '0')}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getFullYear()} ${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}.json`);
                link.click();
                URL.revokeObjectURL(url);
                setShowBackupModal(false); // Fecha o modal após o download
            } else {
                console.error('Resposta vazia ao tentar fazer backup');
            }
        } catch (error) {
            console.error('Erro ao fazer backup:', error);
        }
    };

    // Função para mostrar modal de confirmação
    const showConfirmModal = (message) => {
        return new Promise((resolve) => {
            const handleClose = () => {
                resolve(false);
                destroyModal(container); // Remove o modal do DOM
            };
            const close = () => {
                 destroyModal(container); // Remove o modal do DOM
            };

            const handleConfirm = () => {
                resolve(true);
                destroyModal(container); // Remove o modal do DOM
            };

            const modal = (
                <Modal show={true} onHide={close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmação</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{message}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleConfirm}>
                            Sim
                        </Button>
                        <Button variant="btn btn-warning" onClick={handleClose}>
                            Não
                        </Button>
                    </Modal.Footer>
                </Modal>
            );

            const container = document.createElement('div');
            document.body.appendChild(container);
            ReactDOM.render(modal, container);
        });
    };

    // Função para mostrar modal de sucesso
    const showSuccessModal = (message) => {
        const handleClose = () => {
            destroyModal(container); // Remove o modal do DOM
        };

        const modal = (
            <Modal show={true} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sucesso</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        );

        const container = document.createElement('div');
        document.body.appendChild(container);
        ReactDOM.render(modal, container);
    };

    // Função para destruir o modal do DOM
    const destroyModal = (container) => {
        ReactDOM.unmountComponentAtNode(container); // Desmonta o componente do container
        container.remove(); // Remove o container do DOM
    };

    // Função para lidar com o clique no botão de backup
    const handleBackupClick = () => {
        setShowBackupModal(true);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
            <button type="button" className="btn-baixar" onClick={handleBackupClick}>
                Fazer Backup <CloudDownloadIcon />
            </button>
            <button type="button" className="btn-backup" onClick={handleRestoreClick}>
                Restaurar Backup <CloudDoneIcon />
            </button>

            {/* Modal de restauração */}
            <Modal show={showRestoreModal} onHide={() => setShowRestoreModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Restaurar Backup</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Selecione um arquivo de backup</p>
                    <Button variant="primary" onClick={handleRestoreConfirm}>
                        Selecionar Arquivo
                    </Button>
                </Modal.Body>
            </Modal>

            {/* Modal de backup */}
            <Modal show={showBackupModal} onHide={() => setShowBackupModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Fazer Backup</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Clique no botão abaixo para fazer o download do backup.</p>
                    <Button variant="primary" onClick={handleBackupDownload}>
                        Download do Backup
                    </Button>
                </Modal.Body>
            </Modal>
        </div>
    );
}
export default Backup
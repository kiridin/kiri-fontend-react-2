import service from './service';

export const obter = async () => {
    try {
        const response = await service.get('/produtos');
        return response;
    } catch (error) {
        throw error;
    }
};
export const apagarTudo = async () => {
    try {
        const response = await service.delete('/produtos');
        return response;
    } catch (error) {
        throw error;
    }
};

export  function adicionar(produto){
    return new Promise((resolve, reject) => {
        service.post('/produtos', produto)
        .then(response => resolve(response))
        .catch(erro => reject(erro))
    });
}
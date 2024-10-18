import React, { useEffect } from 'react';

function Wanted({ wanted }) {
    // useEffect para monitorar as alterações nos dados recebidos
    useEffect(() => {
        console.log('Dados recebidos no componente Wanted:', wanted);
    }, [wanted]);

    // Se não houver dados ou o array estiver vazio, exiba uma mensagem
    if (!wanted || wanted.length === 0) {
        return (
            <div>
                <h3>Nenhum resultado encontrado</h3>
            </div>
        );
    }

    // Renderiza apenas o primeiro item do array 'wanted'
    const item = wanted; // Pega o primeiro item do array

    return (
        <div style={{ marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
            <h3>{item.nome}</h3> {/* Mostrando o nome da pessoa */}
            <p>Idade: {item.idade}</p> {/* Mostrando a idade */}
            <p>Crimes: {item.crimes.join(', ')}</p> {/* Mostrando os crimes */}
            
                <img 
                    src={item.photo} 
                />
        
        </div>
    );
}

export default Wanted;

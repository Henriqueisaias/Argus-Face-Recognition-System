function Wanted({ wanted }) { // Use destructuring para acessar a prop 'wanted'

    const wantedGet = {
        nome: "zezin",
        idade: 20,
        crime: "ladrão",
        foto: "https://files.agro20.com.br/uploads/2019/09/maracuja-2-1024x576.jpg"
    };

    return (
        <div>
            {!wanted ? ( // Verifique se 'wanted' é falso
                <div>
                    <h3>Nenhum resultado encontrado</h3>
                </div>
            ) : ( // Se 'wanted' é verdadeiro, renderize os dados
                <div>
                    <h3>{wantedGet.nome}</h3>
                    <p>Idade: {wantedGet.idade}</p>
                    <p>Crime: {wantedGet.crime}</p>
                    <img src={wantedGet.foto} alt={wantedGet.nome} />
                </div>
            )}
        </div>
    );
}

export default Wanted;

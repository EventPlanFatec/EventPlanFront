import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { db } from '../../firebase/config'; // Importando a instância do Firestore
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Para salvar e carregar dados no Firestore

const PerfilUsuario = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');
  const [cpf, setCpf] = useState(''); // Novo estado para CPF
  const [dataNascimento, setDataNascimento] = useState(''); // Novo estado para Data de Nascimento
  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Verifica o estado de autenticação do usuário
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        setUser(user); // Salva as informações do usuário logado
        // Carregar dados do Firestore, se existirem
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setNome(userData.nome || '');
          setSobrenome(userData.sobrenome || '');
          setEstado(userData.estado || '');
          setCidade(userData.cidade || '');
          setBairro(userData.bairro || '');
          setRua(userData.rua || '');
          setNumeroCasa(userData.numeroCasa || '');
          setCpf(userData.cpf || ''); // Preenche o CPF
          setDataNascimento(userData.dataNascimento || ''); // Preenche a Data de Nascimento
          setOriginalData(userData);
        }
      } else {
        setUser(null); // Se não houver usuário logado, retorna null
      }
      setLoading(false); // Define o loading como false após verificar o usuário
    });

    // Limpar o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');
    setSuccess('');

    try {
      // Atualizar o nome e sobrenome no Firebase Authentication
      await updateProfile(user, {
        displayName: `${nome} ${sobrenome}`,
      });

      // Salvar os dados no Firestore para persistência
      await setDoc(doc(db, 'usuarios', user.uid), {
        nome,
        sobrenome,
        estado,
        cidade,
        bairro,
        rua,
        numeroCasa,
        cpf, // Salvar CPF
        dataNascimento, // Salvar Data de Nascimento
      });

      setSuccess('Perfil atualizado com sucesso!');
      setOriginalData({ nome, sobrenome, estado, cidade, bairro, rua, numeroCasa, cpf, dataNascimento });
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err.message);
      setError('Erro ao atualizar perfil: ' + err.message); // Exibe o erro
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDiscardChanges = () => {
    // Restaurar os valores originais
    setNome(originalData.nome);
    setSobrenome(originalData.sobrenome);
    setEstado(originalData.estado);
    setCidade(originalData.cidade);
    setBairro(originalData.bairro);
    setRua(originalData.rua);
    setNumeroCasa(originalData.numeroCasa);
    setCpf(originalData.cpf); // Restaurar CPF
    setDataNascimento(originalData.dataNascimento); // Restaurar Data de Nascimento
  };

  if (loading) {
    return <p>Carregando...</p>; // Exibe uma mensagem enquanto aguarda a verificação do usuário
  }

  if (!user) {
    return <p>Usuário não está logado.</p>; // Exibe mensagem caso o usuário não esteja logado
  }

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      <p><strong>UID:</strong> {user.uid}</p>
      <p><strong>Email:</strong> {user.email}</p>
      
      {/* Campos Editáveis */}
      <form onSubmit={handleSaveChanges}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />
        </div>
        <div>
          <label>Sobrenome:</label>
          <input
            type="text"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            placeholder="Digite seu sobrenome"
          />
        </div>
        <div>
          <label>Estado:</label>
          <input
            type="text"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            placeholder="Digite seu estado"
          />
        </div>
        <div>
          <label>Cidade:</label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Digite sua cidade"
          />
        </div>
        <div>
          <label>Bairro:</label>
          <input
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Digite seu bairro"
          />
        </div>
        <div>
          <label>Rua:</label>
          <input
            type="text"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            placeholder="Digite sua rua"
          />
        </div>
        <div>
          <label>Número da Casa:</label>
          <input
            type="text"
            value={numeroCasa}
            onChange={(e) => setNumeroCasa(e.target.value)}
            placeholder="Digite o número da sua casa"
          />
        </div>
        
        {/* Campos Não Editáveis */}
        <div>
          <label>CPF:</label>
          <p>{cpf}</p> {/* Exibindo o CPF como texto não editável */}
        </div>
        <div>
          <label>Data de Nascimento:</label>
          <p>{dataNascimento}</p> {/* Exibindo a Data de Nascimento como texto não editável */}
        </div>

        <div>
          <button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Atualizando...' : 'Salvar alterações'}
          </button>
          <button type="button" onClick={handleDiscardChanges} disabled={isUpdating}>
            Descartar
          </button>
        </div>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default PerfilUsuario;

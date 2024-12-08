import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { db, storage } from '../../firebase/config'; // Adicionando o storage
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Para upload e obter URL
import { FaPen } from 'react-icons/fa'; // Ícone de lápis do React Icons
import styles from "../PerfilUsuario/PerfilUsuario.module.css";

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
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null); // Estado para armazenar a imagem
  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModified, setIsModified] = useState(false); // Novo estado para verificar alterações

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        setUser(user);
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
          setCpf(userData.cpf || '');
          setDataNascimento(userData.dataNascimento || '');
          setOriginalData(userData);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoPerfil(file);
      setIsModified(true); // Alterou a foto, marca como modificado
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');
    setSuccess('');

    try {
      let photoURL = user.photoURL;

      if (fotoPerfil) {
        const storageRef = ref(storage, `perfil/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, fotoPerfil);

        await uploadTask;
        photoURL = await getDownloadURL(uploadTask.snapshot.ref);
      }

      await updateProfile(user, {
        displayName: `${nome} ${sobrenome}`,
        photoURL,
      });

      await setDoc(doc(db, 'usuarios', user.uid), {
        nome,
        sobrenome,
        estado,
        cidade,
        bairro,
        rua,
        numeroCasa,
        cpf,
        dataNascimento,
        photoURL, // Salvar a URL da foto no Firestore
      });

      setSuccess('Perfil atualizado com sucesso!');
      setOriginalData({ nome, sobrenome, estado, cidade, bairro, rua, numeroCasa, cpf, dataNascimento, photoURL });
      setIsModified(false); // Após salvar, setamos como não modificado
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err.message);
      setError('Erro ao atualizar perfil: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return <p>Usuário não está logado.</p>;
  }

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      <p><strong>UID:</strong> {user.uid}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {/* Exibir imagem de perfil, se existir */}
      <div>
        <label>Foto de Perfil:</label>
        {user.photoURL ? (
          <img src={user.photoURL} alt="Foto de Perfil" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        ) : (
          <p>Nenhuma foto de perfil.</p>
        )}
        {/* Botão de ícone de lápis */}
        <button onClick={() => document.getElementById('fotoPerfilInput').click()} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
          <FaPen size={20} color="gray" />
        </button>
        <input
          type="file"
          id="fotoPerfilInput"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      <form onSubmit={handleSaveChanges}>
        <div>
          <label>Nome:</label>
          <input type="text" value={nome} onChange={(e) => { setNome(e.target.value); setIsModified(true); }} placeholder="Digite seu nome" />
        </div>
        <div>
          <label>Sobrenome:</label>
          <input type="text" value={sobrenome} onChange={(e) => { setSobrenome(e.target.value); setIsModified(true); }} placeholder="Digite seu sobrenome" />
        </div>
        <div>
          <label>Estado:</label>
          <input type="text" value={estado} onChange={(e) => { setEstado(e.target.value); setIsModified(true); }} placeholder="Digite seu estado" />
        </div>
        <div>
          <label>Cidade:</label>
          <input type="text" value={cidade} onChange={(e) => { setCidade(e.target.value); setIsModified(true); }} placeholder="Digite sua cidade" />
        </div>
        <div>
          <label>Bairro:</label>
          <input type="text" value={bairro} onChange={(e) => { setBairro(e.target.value); setIsModified(true); }} placeholder="Digite seu bairro" />
        </div>
        <div>
          <label>Rua:</label>
          <input type="text" value={rua} onChange={(e) => { setRua(e.target.value); setIsModified(true); }} placeholder="Digite sua rua" />
        </div>
        <div>
          <label>Número da Casa:</label>
          <input type="text" value={numeroCasa} onChange={(e) => { setNumeroCasa(e.target.value); setIsModified(true); }} placeholder="Digite o número da sua casa" />
        </div>

        <div>
          <button type="submit" disabled={isUpdating || !isModified}>
            {isUpdating ? 'Atualizando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default PerfilUsuario;

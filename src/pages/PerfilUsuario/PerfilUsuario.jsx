import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { db, storage } from '../../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FaPen } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Importando o Toastify
import 'react-toastify/dist/ReactToastify.css'; // Importando o CSS do Toastify
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
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [originalData, setOriginalData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModified, setIsModified] = useState(false);

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
          setFotoPerfil(userData.fotoPerfil || null); // Carregar foto de perfil do Firestore
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
      setIsModified(true);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
  
    try {
      let updatedPhotoURL = user.photoURL;

      if (fotoPerfil && typeof fotoPerfil !== 'string') {
        const storageRef = ref(storage, `perfil/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, fotoPerfil);

        await uploadTask;
        updatedPhotoURL = await getDownloadURL(uploadTask.snapshot.ref);
      }

      await updateProfile(user, {
        displayName: `${nome} ${sobrenome}`,
        photoURL: updatedPhotoURL,
      });

      const userDocRef = doc(db, 'usuarios', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const existingData = userDocSnap.exists() ? userDocSnap.data() : {};

      const finalPhotoURL = updatedPhotoURL || existingData.photoURL || null;

      await setDoc(userDocRef, {
        ...existingData,
        nome,
        sobrenome,
        estado,
        cidade,
        bairro,
        rua,
        numeroCasa,
        cpf,
        dataNascimento,
        photoURL: finalPhotoURL,
        email: user.email,
      });

      // Exibe mensagem de sucesso com Toastify
      toast.success('Perfil atualizado com sucesso!');
      
      setOriginalData({
        ...existingData,
        nome,
        sobrenome,
        estado,
        cidade,
        bairro,
        rua,
        numeroCasa,
        cpf,
        dataNascimento,
        photoURL: finalPhotoURL,
      });
      setIsModified(false);
    } catch (err) {
      // Exibe mensagem de erro com Toastify
      toast.error(`Erro ao atualizar perfil: ${err.message}`);
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
      <p><strong>Email:</strong> {user.email}</p>

      <div>
        <label>Foto de Perfil:</label>
        {fotoPerfil ? (
          <img
            src={typeof fotoPerfil === 'string' ? fotoPerfil : user.photoURL}
            alt="Foto de Perfil"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
        ) : (
          <p>Nenhuma foto de perfil.</p>
        )}
        <button
          onClick={() => document.getElementById('fotoPerfilInput').click()}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
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
          <input type="text" value={nome} onChange={(e) => { setNome(e.target.value); setIsModified(true); }} />
        </div>
        <div>
          <label>Sobrenome:</label>
          <input type="text" value={sobrenome} onChange={(e) => { setSobrenome(e.target.value); setIsModified(true); }} />
        </div>
        <div>
          <label>Estado:</label>
          <input type="text" value={estado} onChange={(e) => { setEstado(e.target.value); setIsModified(true); }} />
        </div>
        <div>
          <label>Cidade:</label>
          <input type="text" value={cidade} onChange={(e) => { setCidade(e.target.value); setIsModified(true); }} />
        </div>
        <div>
          <label>Bairro:</label>
          <input type="text" value={bairro} onChange={(e) => { setBairro(e.target.value); setIsModified(true); }} />
        </div>
        <div>
          <label>Rua:</label>
          <input type="text" value={rua} onChange={(e) => { setRua(e.target.value); setIsModified(true); }} />
        </div>
        <div>
          <label>Número da Casa:</label>
          <input type="text" value={numeroCasa} onChange={(e) => { setNumeroCasa(e.target.value); setIsModified(true); }} />
        </div>

        <div>
          <button type="submit" disabled={isUpdating || !isModified}>
            {isUpdating ? 'Atualizando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PerfilUsuario;

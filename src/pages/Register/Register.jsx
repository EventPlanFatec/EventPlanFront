import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage } from '../../firebase/config'; // Importando storage para o Firebase Storage
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cpf, setCpf] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numeroPredial, setNumeroPredial] = useState('');
  const [complemento, setComplemento] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('usuariofinal');
  const [fotoPerfil, setFotoPerfil] = useState(null); // Para armazenar a foto de perfil
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (tipoUsuario === 'usuariofinal' && (!nome || !cpf || !sobrenome || !dataNascimento)) || 
        (tipoUsuario === 'organizacao' && (!nome || !cnpj)) || 
        (tipoUsuario === 'adm' && (!nome || !cpf || !sobrenome || !dataNascimento))) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Criando o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let userDocRef;
      let fotoURL = ''; // URL da foto de perfil

      if (fotoPerfil) {
        // Upload da foto de perfil para o Firebase Storage
        const storageRef = ref(storage, `perfil/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, fotoPerfil);

        // Esperando o upload da imagem ser concluído
        await uploadTask.then(() => {
          return getDownloadURL(uploadTask.snapshot.ref);
        }).then((downloadURL) => {
          fotoURL = downloadURL;
        }).catch((err) => {
          setError('Erro ao fazer upload da foto de perfil');
          setLoading(false);
          return;
        });
      }

      if (tipoUsuario === 'organizacao') {
        userDocRef = doc(db, 'organizacao', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            nome: nome,
            cnpj: cnpj,
            estado: estado,
            cidade: cidade,
            bairro: bairro,
            logradouro: logradouro,
            numeroPredial: numeroPredial,
            complemento: complemento,
            fotoPerfil: fotoURL, // Salvando a URL da foto
            createdAt: new Date(),
          });
        }
        navigate('/perfilorganizacao');
      } else if (tipoUsuario === 'usuariofinal') {
        userDocRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            nome: nome,
            cpf: cpf,
            sobrenome: sobrenome,
            dataNascimento: dataNascimento,
            estado: estado,
            cidade: cidade,
            bairro: bairro,
            logradouro: logradouro,
            numeroPredial: numeroPredial,
            complemento: complemento,
            fotoPerfil: fotoURL, // Salvando a URL da foto
            createdAt: new Date(),
          });
        }
        navigate('/perfilusuario');
      } else if (tipoUsuario === 'adm') {
        userDocRef = doc(db, 'usuariosadm', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            nome: nome,
            cpf: cpf,
            sobrenome: sobrenome,
            dataNascimento: dataNascimento,
            estado: estado,
            cidade: cidade,
            bairro: bairro,
            logradouro: logradouro,
            numeroPredial: numeroPredial,
            complemento: complemento,
            fotoPerfil: fotoURL, // Salvando a URL da foto
            createdAt: new Date(),
          });
        }
        navigate('/perfiladm');
      }

      console.log('Documento criado no Firestore!');
    } catch (err) {
      console.error('Erro ao criar usuário:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Registrar</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>
        <div>
          <label>Tipo de Usuário:</label>
          <select onChange={(e) => setTipoUsuario(e.target.value)} value={tipoUsuario}>
            <option value="usuariofinal">Usuário Final</option>
            <option value="organizacao">Organização</option>
            <option value="adm">Administrador</option>
          </select>
        </div>

        {/* Campos específicos para cada tipo de usuário */}
        {tipoUsuario === 'organizacao' && (
          <>
            <div>
              <label>Nome da Organização:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome da organização"
              />
            </div>
            <div>
              <label>CNPJ:</label>
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="Digite o CNPJ"
              />
            </div>
          </>
        )}

        {tipoUsuario === 'usuariofinal' && (
          <>
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
              <label>CPF:</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Digite seu CPF"
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
              <label>Data de Nascimento:</label>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
            </div>
            <div>
              <label>Foto de Perfil:</label>
              <input
                type="file"
                onChange={(e) => setFotoPerfil(e.target.files[0])}
              />
            </div>
          </>
        )}

        {tipoUsuario === 'adm' && (
          <>
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
              <label>CPF:</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Digite seu CPF"
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
              <label>Data de Nascimento:</label>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
            </div>
            <div>
              <label>Foto de Perfil:</label>
              <input
                type="file"
                onChange={(e) => setFotoPerfil(e.target.files[0])}
              />
            </div>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

export default Register;

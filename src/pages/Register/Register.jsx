import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage } from '../../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import styles from '../Register/Register.module.css';
import ReactInputMask from 'react-input-mask';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Para confirmar a senha
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
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || password !== confirmPassword || !passwordValidation.test(password) || 
        (tipoUsuario === 'usuariofinal' && (!nome || !cpf || !sobrenome || !dataNascimento)) || 
        (tipoUsuario === 'organizacao' && (!nome || !cnpj)) || 
        (tipoUsuario === 'adm' && (!nome || !cpf || !sobrenome || !dataNascimento))) {
      setError('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let userDocRef;
      let fotoURL = '';

      if (fotoPerfil) {
        const storageRef = ref(storage, `perfil/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, fotoPerfil);

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
            fotoPerfil: fotoURL,
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
            fotoPerfil: fotoURL,
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
            fotoPerfil: fotoURL,
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
          <label>Confirme sua Senha:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua senha"
          />
        </div>
        <div>
          <label>Tipo de Usuário:</label>
          <select onChange={(e) => setTipoUsuario(e.target.value)} value={tipoUsuario}>
            <option value="usuariofinal">Usuário Final</option>
            <option value="organizacao">Organização</option>
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
              <ReactInputMask
                mask="99.999.999/9999-99"
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
              <ReactInputMask
                mask="999.999.999-99"
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
              <ReactInputMask
                mask="999.999.999-99"
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
          </>
        )}

        <div>
          <button type="submit" disabled={loading}>Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default Register;

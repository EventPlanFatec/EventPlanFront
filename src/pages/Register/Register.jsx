import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/config'; // Importando auth e db
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate para redirecionamento

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
  const [tipoUsuario, setTipoUsuario] = useState('usuariofinal'); // "organizacao", "usuariofinal", "adm"
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook para navegação

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validando os campos antes de tentar criar o usuário
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
      console.log('Usuário criado com sucesso!');

      let userDocRef;
      if (tipoUsuario === 'organizacao') {
        // Criando documento na coleção 'organizacao' com o UID
        userDocRef = doc(db, 'organizacao', user.uid); // Cria ou atualiza documento na coleção 'organizacao'
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
            createdAt: new Date(),
          });
          console.log('Organização criada no Firestore!');
        }
        // Redirecionando para o perfil da organização
        navigate('/perfilorganizacao');
      } else if (tipoUsuario === 'usuariofinal') {
        // Criando documento na coleção 'usuarios' com o UID
        userDocRef = doc(db, 'usuarios', user.uid); // Cria ou atualiza documento na coleção 'usuarios'
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
            createdAt: new Date(),
          });
          console.log('Usuário final criado no Firestore!');
        }
        // Redirecionando para o perfil do usuário final
        navigate('/perfilusuario');
      } else if (tipoUsuario === 'adm') {
        // Criando documento na coleção 'usuariosadm' com o UID
        userDocRef = doc(db, 'usuariosadm', user.uid); // Cria ou atualiza documento na coleção 'usuariosadm'
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
            emailAdm: email, // Aqui você pode adicionar o email do usuário ADM que autorizou
            createdAt: new Date(),
          });
          console.log('Administrador criado no Firestore!');
        }
        // Redirecionando para o perfil do administrador
        navigate('/perfiladm');
      }

      // Sucesso no registro
      console.log('Documento criado no Firestore!');
    } catch (err) {
      console.error('Erro ao criar usuário:', err.message);
      setError(err.message); // Exibindo o erro caso ocorra
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

import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { db, storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const UploadAnuncio = () => {
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false); // Verifica se o pagamento foi concluído
  const [isLoading, setIsLoading] = useState(false); // Controla o estado de carregamento
  const [totalAmount, setTotalAmount] = useState(0); // Valor total baseado na duração
  const user = getAuth().currentUser;

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAudioChange = (e) => {
    if (e.target.files[0]) {
      const audioFile = e.target.files[0];
      if (audioFile.size > 15000 * 1024) {
        setError('O áudio deve ter no máximo 15 segundos.');
        return;
      }
      setAudio(audioFile);
    }
  };

  const handleDurationChange = (e) => {
    const days = e.target.value;
    setDuration(days);
    setTotalAmount(days * 10000); // Calcula o valor total: 10.000 reais por dia
  };

  const handlePayment = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Simulando uma lógica de pagamento.
      // Aqui você deve integrar com o serviço de pagamento desejado, como Stripe ou PayPal.
      const paymentResponse = await mockPaymentService(duration);

      if (paymentResponse.success) {
        setPaymentConfirmed(true);
        setIsLoading(false);
        setSuccess('Pagamento confirmado! Agora você pode enviar o anúncio.');
      } else {
        throw new Error('Pagamento não foi concluído. Tente novamente.');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Erro ao processar pagamento.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!paymentConfirmed) {
      setError('O pagamento deve ser concluído antes de enviar o anúncio.');
      return;
    }
    if (!image || !duration) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const storageRefImage = ref(storage, `anuncios/${user.uid}/${image.name}`);
      await uploadBytes(storageRefImage, image);
      const imageUrl = await getDownloadURL(storageRefImage);

      let audioUrl = '';
      if (audio) {
        const storageRefAudio = ref(storage, `anuncios/${user.uid}/${audio.name}`);
        await uploadBytes(storageRefAudio, audio);
        audioUrl = await getDownloadURL(storageRefAudio);
      }

      await addDoc(collection(db, 'anuncios'), {
        imageUrl,
        audioUrl,
        duration: parseInt(duration),
        totalAmount,
        startDate: serverTimestamp(),
        organizationId: user.uid,
        isActive: false, // Inicialmente não ativo
      });

      setSuccess('Anúncio enviado com sucesso!');
      setImage(null);
      setAudio(null);
      setDuration('');
      setTotalAmount(0);
      setPaymentConfirmed(false); // Resetar o estado do pagamento para o próximo envio
    } catch (err) {
      setError('Erro ao enviar anúncio: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Enviar Anúncio</h1>
      <form onSubmit={handleUpload}>
        <div>
          <label>Imagem:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div>
          <label>Áudio (até 15 segundos):</label>
          <input type="file" accept="audio/*" onChange={handleAudioChange} />
        </div>
        <div>
          <label>Duração (em dias):</label>
          <input
            type="number"
            value={duration}
            onChange={handleDurationChange}
            placeholder="Quantos dias o anúncio ficará ativo"
          />
        </div>

        {/* Exibição do valor do anúncio */}
        {duration > 0 && (
          <div>
            <p>Valor total: R$ {totalAmount.toLocaleString('pt-BR')}</p>
          </div>
        )}

        {/* Botão de pagamento */}
        {!paymentConfirmed && (
          <button type="button" onClick={handlePayment} disabled={isLoading}>
            {isLoading ? 'Processando pagamento...' : 'Realizar Pagamento'}
          </button>
        )}

        {/* Botão de enviar o anúncio após o pagamento ser confirmado */}
        {paymentConfirmed && (
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Enviando anúncio...' : 'Enviar Anúncio'}
          </button>
        )}
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

// Mock para simular o serviço de pagamento
const mockPaymentService = (duration) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (duration > 0) {
        resolve({ success: true });
      } else {
        resolve({ success: false });
      }
    }, 2000);
  });
};

export default UploadAnuncio;

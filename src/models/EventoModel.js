class EventoModel {
  constructor({
    id = null,
    nome = '',
    date = new Date(),
    descricao = '',
    local = '',
    tipo = '',
    capacidade = null,
    valorMin = null,
    img = ''
  }) {
    this.id = id;
    this.nome = nome;
    this.date = date;
    this.descricao = descricao;
    this.local = local;
    this.tipo = tipo;
    this.capacidade = capacidade;
    this.valorMin = valorMin;
    this.img = img;
  }

  validate() {
    const errors = [];

    if (!this.nome || this.nome.trim() === '') {
      errors.push('Nome do evento é obrigatório');
    }

    if (!this.date) {
      errors.push('Data do evento é obrigatória');
    }

    if (this.date && this.date < new Date()) {
      errors.push('A data do evento não pode ser no passado');
    }

    if (!this.descricao || this.descricao.trim() === '') {
      errors.push('Descrição do evento é obrigatória');
    }

    if (this.capacidade && this.capacidade <= 0) {
      errors.push('Capacidade deve ser um número positivo');
    }

    return errors;
  }

  toFirestore() {
    return {
      nome: this.nome,
      date: this.date instanceof Date ? this.date.toISOString() : null,
      descricao: this.descricao,
      local: this.local,
      tipo: this.tipo,
      capacidade: this.capacidade,
      valorMin: this.valorMin,
      img: this.img
    };
  }
  

  getDataFormatada() {
    return this.date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  isEventoPassed() {
    return this.date < new Date();
  }

  static fromFirestore(id, data) {
    return new EventoModel({
      id,
      ...data,
      date: data.date ? new Date(data.date) : new Date(), 
    });
  }
}

export default EventoModel;

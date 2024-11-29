class EventoModel {
    constructor({
      id = null,
      nome = '',
      date = new Date(),
      description = '',
      local = '',
      type = '',
      capacity = null,
      price = null
    }) {
      this.id = id;
      this.nome = nome;
      this.date = date;
      this.description = description;
      this.local = local;
      this.type = type;
      this.capacity = capacity;
      this.price = price;
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
  
      if (!this.description || this.description.trim() === '') {
        errors.push('Descrição do evento é obrigatória');
      }
  
      if (this.capacity && this.capacity <= 0) {
        errors.push('Capacidade deve ser um número positivo');
      }
  
      return errors;
    }
  
    toFirestore() {
      return {
        nome: this.nome,
        date: this.date,
        description: this.description,
        local: this.local,
        type: this.type,
        capacity: this.capacity,
        price: this.price
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
        date: data.date instanceof Date ? data.date : new Date(data.date)
      });
    }
  }
  
  export default EventoModel;
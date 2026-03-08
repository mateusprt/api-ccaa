export default class Document {
   private CPF_LENGTH = 11;
    private value: string;
    
    constructor(value: string) {
      if (!this.validateCpf(value)) throw new Error("Invalid document");
      this.value = value;
    }

    getValue() {
      return this.value;
    }

    private validateCpf(cpf: string): boolean {
      cpf = this.clean(cpf);
      if (cpf.length !== this.CPF_LENGTH) return false;
      if (this.isSameSequence(cpf)) return false;
      const digit1 = this.calculateDigit(cpf, 10);
      const digit2 = this.calculateDigit(cpf, 11);
      if (this.extractDigit(cpf) !== `${digit1}${digit2}`) return false;
      return true;
    }

    private clean (cpf: string) {
      return cpf.replace(/\D/g, "");
    }

    private isSameSequence (cpf: string) {
      const [firstDigit] = cpf;
      return [...cpf].every(digit => digit === firstDigit);
    }

    private calculateDigit (cpf: string, factor: number) {
      let sum = 0;
      for (const digit of cpf) {
        if (factor > 1) sum += parseInt(digit) * factor--;
      }
      const rest = sum % this.CPF_LENGTH;
      return (rest < 2) ? 0 : this.CPF_LENGTH - rest;
    }

    private extractDigit (cpf: string) {
      return cpf.slice(9);
    }
}
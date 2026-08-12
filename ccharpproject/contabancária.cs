using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CcharpProject {
    internal class ContaBancária {

        public int Numero { get; private set; }
        public string Titular { get; set; }
        public double Saldo { get; private set; }

        public ContaBancária(int numero, string titular) {
            Numero = numero;
            Titular = titular;
        }

        public ContaBancária(int numero, string titular, double saldo) : this(numero, titular) { 
              Saldo = saldo;
        }

        public void Deposito(double quantia) {
            Saldo += quantia;
        }

        public void Saque (double quantia) {
            Saldo = Saldo - quantia -  5.0;
        }



        public override string ToString() {
            return $"Conta: {Numero}, Titular: {Titular}, Saldo: $ {Saldo.ToString("F2")}";
        }







    }
}

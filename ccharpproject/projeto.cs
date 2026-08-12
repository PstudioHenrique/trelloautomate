
using CcharpProject;
using System;
using System.Globalization;
using System.Runtime.CompilerServices;
using System.Security.Principal;

namespace MyApp {
    internal class Projeto {
        static void Main(string[] args) {

            ContaBancária conta;

            Console.WriteLine("Entre com o número da conta: ");
            int numero = int.Parse(Console.ReadLine());

            Console.WriteLine("Entre com o Titular da conta: ");
            string titular = Console.ReadLine();

            Console.WriteLine("Haverá depoósito inicial (s/n)? ");
            string resposta = Console.ReadLine();

            while(resposta != "s" && resposta != "n") {
                Console.WriteLine("Esta não é uma resposta válida por favor responda com s ou n");
                resposta = Console.ReadLine();
            }

            if (resposta == "s") {
                Console.WriteLine("Entre com o valor do depósito: ");
                double depositoInicial = double.Parse(Console.ReadLine());
                conta = new ContaBancária(numero, titular, depositoInicial);
            }

            else  {
                conta = new ContaBancária(numero, titular);
            }

            Console.WriteLine();
            Console.WriteLine("Dados da conta: ");
            Console.WriteLine(conta);

            Console.WriteLine("Quanto deseja depositar: ");
            double deposito = double.Parse(Console.ReadLine());
            conta.Deposito(deposito);
            Console.WriteLine();
            Console.WriteLine("Dados atualizados: ");
            Console.WriteLine(conta);


            Console.WriteLine("Quanto deseja sacar (R$5,00 de taxa): ");
            double saque = double.Parse(Console.ReadLine());
            conta.Saque(saque);
            Console.WriteLine("Dados atualizados: ");
            Console.WriteLine(conta);



        }

    }
}
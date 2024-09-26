import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

type Pessoa = {
  nome: string;
  valor: number;
  ajustado: boolean;
};

export default function CadastroConta() {
  const [nomeConta, setNomeConta] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [quantidadePessoas, setQuantidadePessoas] = useState('');
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const router = useRouter();

  const adicionarPessoas = () => {
    const listaPessoas = Array.from({ length: Number(quantidadePessoas) }, (_, i) => ({
      nome: `Pessoa ${i + 1}`,
      valor: Number(valorTotal) / Number(quantidadePessoas),
      ajustado: false,
    }));
    setPessoas(listaPessoas);
  };

  const atualizarPessoa = (index: number, nome: string, valor: string) => {
    const novasPessoas = [...pessoas];
    novasPessoas[index].nome = nome;
    novasPessoas[index].valor = Math.floor(Number(valor));
    novasPessoas[index].ajustado = true;

    const totalAjustado = novasPessoas.reduce(
      (acc, pessoa) => acc + (pessoa.ajustado ? pessoa.valor : 0),
      0
    );

    const pessoasNaoAjustadas = novasPessoas.filter(p => !p.ajustado);

    const valorRestante = Number(valorTotal) - totalAjustado;
    const valorPorPessoa = valorRestante / pessoasNaoAjustadas.length;

    const pessoasAtualizadas = novasPessoas.map(p =>
      p.ajustado ? p : { ...p, valor: valorPorPessoa }
    );

    setPessoas(pessoasAtualizadas);
  };

  const salvarConta = () => {
    const conta = {
      nomeConta,
      valorTotal: Number(valorTotal),
      pessoas,
    };

    let contasSalvas = [];
    const contasJSON = localStorage.getItem('contas') || '[]';
    contasSalvas = JSON.parse(contasJSON);

    contasSalvas.push(conta);
    localStorage.setItem('contas', JSON.stringify(contasSalvas));

    router.push('/contas/historico');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da Conta"
        value={nomeConta}
        onChangeText={setNomeConta}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor Total"
        value={valorTotal}
        onChangeText={setValorTotal}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade de Pessoas"
        value={quantidadePessoas}
        onChangeText={setQuantidadePessoas}
        keyboardType="numeric"
      />
      <TouchableOpacity style={[styles.button, styles.addButton]} onPress={adicionarPessoas}>
        <Text style={styles.buttonText}>Adicionar Pessoas</Text>
      </TouchableOpacity>
      <FlatList
        data={pessoas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <TextInput
              style={styles.inputNome}
              value={item.nome}
              onChangeText={(nome) => atualizarPessoa(index, nome, item.valor.toString())}
            />
            <TextInput
              style={styles.inputValor}
              value={item.valor.toString()}
              onChangeText={(valor) => atualizarPessoa(index, item.nome, valor)}
              keyboardType="numeric"
            />
          </View>
        )}
      />
      <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={salvarConta}>
        <Text style={styles.buttonText}>Salvar Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.historyButton]} onPress={() => router.push('/contas/historico')}>
        <Text style={styles.buttonText}>Ver Histórico</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#d3d3d3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  inputNome: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0', 
    flex: 2,
    justifyContent: 'center',
  },
  inputValor: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0', 
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#f0f0f0',
    marginBottom: 5,
    borderRadius: 5,
  },
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#00008b', 
  },
  saveButton: {
    backgroundColor: '#006400', 
  },
  historyButton: {
    backgroundColor: '#8b4513', 
  },
});
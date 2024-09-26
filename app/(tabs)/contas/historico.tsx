import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

type Conta = {
  nomeConta: string;
  valorTotal: number;
  pessoas: {
    nome: string;
    valor: number;
  }[];
};

export default function HistoricoContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const router = useRouter();

  useEffect(() => {
    const contasSalvasJSON = localStorage.getItem('contas') || '[]';
    const contasSalvas = JSON.parse(contasSalvasJSON);
    setContas(contasSalvas);
  }, []);

  const deletarConta = (nomeConta: string) => {
    const contasSalvasJSON = localStorage.getItem('contas') || '[]';
    const contasSalvas = JSON.parse(contasSalvasJSON);

    const contasAtualizadas = contasSalvas.filter((c: Conta) => c.nomeConta !== nomeConta);
    localStorage.setItem('contas', JSON.stringify(contasAtualizadas));
    setContas(contasAtualizadas);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Contas</Text>
      <FlatList
        data={contas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.nomeConta}</Text>
            <Text style={styles.itemText}>Valor Total: {item.valorTotal.toFixed(2)}</Text>
            <Text style={styles.itemText}>Número de Pessoas: {item.pessoas.length}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.detailsButton]} onPress={() => router.push(`/contas/detalhes?id=${item.nomeConta}`)}>
                <Text style={styles.buttonText}>Ver Detalhes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => deletarConta(item.nomeConta)}>
                <Text style={styles.buttonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.push('/contas')}>
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        }
      />
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
  item: {
    padding: 10,
    backgroundColor: '#f0f0f0', 
    marginBottom: 10,
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  detailsButton: {
    backgroundColor: '#00008b', 
  },
  deleteButton: {
    backgroundColor: '#8b0000',
  },
  backButton: {
    backgroundColor: '#4b4b4b', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center', 
    marginVertical: 20, 
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
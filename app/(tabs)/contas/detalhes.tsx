import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

type Pessoa = {
  nome: string;
  valor: number;
};

type Conta = {
  nomeConta: string;
  valorTotal: number;
  pessoas: Pessoa[];
};

export default function DetalhesConta() {
  const { id } = useLocalSearchParams();
  const [conta, setConta] = useState<Conta | null>(null);
  const router = useRouter();

  useEffect(() => {
    const contasSalvasJSON = localStorage.getItem('contas') || '[]';
    const contasSalvas = JSON.parse(contasSalvasJSON);

    const contaEncontrada = contasSalvas.find((c: Conta) => c.nomeConta === id);
    setConta(contaEncontrada || null);
  }, [id]);

  if (!conta) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Conta não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{conta.nomeConta}</Text>
      <FlatList
        data={conta.pessoas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.nome}</Text>
            <Text style={styles.itemText}>{item.valor.toFixed(2)}</Text>
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalText}>{conta.valorTotal.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Voltar</Text>
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
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  itemText: {
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#4b4b4b', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center', 
    marginTop: 20, 
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
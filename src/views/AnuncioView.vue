<template>
  <div class="anuncios">
    <h1>Gerenciar Anúncios</h1>

    <!-- Formulário de cadastro -->
    <div>
      <h3>Cadastrar Novo Anúncio</h3>
      <form @submit.prevent="cadastrarAnuncio">
        <div>
          <label for="nome">Nome:</label>
          <input id="nome" v-model="novoAnuncio.nomeProduto" type="text" required />
        </div>
        <div>
          <label for="descricao">Descrição:</label>
          <input id="descricao" v-model="novoAnuncio.descricao" type="text" />
        </div>
        <div>
          <label for="preco">Preço:</label>
          <input id="preco" v-model="novoAnuncio.preco" type="number" required />
        </div>
        <div>
          <label for="dataCadastro">Data/Hora de Cadastro:</label>
          <input id="dataCadastro" v-model="novoAnuncio.dataCadastro" type="datetime-local" required />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>

    <!-- Campo de busca -->
    <div>
      <h3>Buscar Anúncio</h3>
      <form @submit.prevent="buscarAnuncio">
        <div>
          <label for="dataCadastroBusca">Data/Hora de Cadastro:</label>
          <input id="dataCadastroBusca" v-model="busca.dataCadastro" type="datetime-local" />
        </div>
        <div>
          <label for="precoBusca">Preço:</label>
          <input id="precoBusca" v-model="busca.preco" type="number" />
        </div>
        <button type="submit">Buscar</button>
      </form>
    </div>

    <!-- Lista de anúncios -->
    <div v-if="anuncios.length > 0">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="anuncio in anuncios" :key="anuncio.id">
            <td>{{ anuncio.id }}</td>
            <td>{{ anuncio.nomeProduto }}</td>
            <td>{{ anuncio.preco }}</td>
            <td>{{ anuncio.situacao }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>{{ mensagemErro }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'https://8080-rebecagama-springtopico-z041qj2hb29.ws-us116.gitpod.io/anuncio';

const anuncios = ref<any[]>([]);
const novoAnuncio = ref({
  nomeProduto: '',
  descricao: '',
  preco: null,
  dataCadastro: ''
});
const busca = ref({
  dataCadastro: '',
  preco: null
});
const mensagemErro = ref('');

// Função para buscar todos os anúncios
const buscarTodosAnuncios = async () => {
  try {
    const resposta = await axios.get(API_URL);
    anuncios.value = resposta.data.map((anuncio: any) => ({
      ...anuncio,
      situacao: anuncio.anc_descricao || 'pendente'
    }));
  } catch (erro) {
    mensagemErro.value = 'Erro ao carregar anúncios.';
  }
};

// Função para cadastrar um novo anúncio
const cadastrarAnuncio = async () => {
  try {
    await axios.post(API_URL, novoAnuncio.value);
    await buscarTodosAnuncios();
    novoAnuncio.value = { nomeProduto: '', descricao: '', preco: null, dataCadastro: '' };
  } catch (erro) {
    mensagemErro.value = 'Erro ao cadastrar o anúncio. Verifique os campos obrigatórios.';
  }
};

// Função para buscar anúncios por critérios
const buscarAnuncio = async () => {
  try {
    const { dataCadastro, preco } = busca.value;

    // Valida se os parâmetros necessários foram fornecidos
    if (!dataCadastro || preco === null) {
      mensagemErro.value = 'Preencha os campos de data e preço para realizar a busca.';
      anuncios.value = [];
      return;
    }

    // Monta a URL com os parâmetros fornecidos
    const url = `${API_URL}/buscaPreco/${dataCadastro}/${preco}`;

    // Faz a requisição
    const resposta = await axios.get(url);

    if (resposta.data.length > 0) {
      anuncios.value = resposta.data.map((anuncio: any) => ({
        ...anuncio,
        situacao: anuncio.anc_descricao || 'pendente',
      }));
      mensagemErro.value = '';
    } else {
      anuncios.value = [];
      mensagemErro.value = 'Nenhum anúncio foi encontrado para os critérios fornecidos.';
    }
  } catch (erro) {
    mensagemErro.value = 'Erro ao buscar anúncios. Verifique os parâmetros e tente novamente.';
  }
};

// Inicializa a lista de anúncios ao carregar a página
onMounted(buscarTodosAnuncios);
</script>

<style>
.anuncios {
  padding: 20px;
}

form {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

p {
  color: red;
}
</style>
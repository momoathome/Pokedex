import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  withCredentials: false,
})

export default {
  getPokemonData(count, offset) {
    return apiClient.get(`/pokemon?offset=${offset}&limit=${count}`)
  },
  getPokemonDetails(url) {
    return axios.get(`${url}`)
  },
  getPokemonById(id) {
    return apiClient.get(`pokemon/${id}`)
  },
  getPokemonByName(name) {
    return apiClient.get(`pokemon/${name}`)
  },
}

import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  withCredentials: false,
})

export default {
  getPokemonNames(count, offset) {
    return apiClient.get(`/pokemon?offset=${offset}&limit=${count}`)
  },
  getPokemonDetails(url) {
    return axios.get(`${url}`)
  },
}

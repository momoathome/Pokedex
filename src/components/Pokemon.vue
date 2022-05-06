<template>
  <div>
    <div
      class="rectangle"
      @click="showModal(pokemon)"
      :style="pokemon.types[1] ? createBackgroundString : createMainBackground"
    >
      <img :src="pokemon.sprites.front_default" class="img" />
      <div class="poke-name">
        <h3>{{ pokemon.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import EventService from '../services/EventService'

export default {
  name: 'Pokemon',
  props: {
    pokemon: Object,
  },
  data: () => ({
    types: {
      normal: '#A8A77A',
      fire: '#EE8130',
      water: '#6390F0',
      electric: '#F7D02C',
      grass: '#7AC74C',
      ice: '#96D9D6',
      fighting: '#C22E28',
      poison: '#A33EA1',
      ground: '#E2BF65',
      flying: '#A98FF3',
      psychic: '#F95587',
      bug: '#A6B91A',
      rock: '#B6A136',
      ghost: '#735797',
      dragon: '#6F35FC',
      dark: '#705746',
      steel: '#B7B7CE',
      fairy: '#D685AD',
    },
  }),
  methods: {
    async showModal(pokemon) {
      await this.setPokemonSpecies(pokemon.species.url)

      this.$emit('show-modal-data', pokemon)
    },
    getPokemonDetails(url) {
      const result = EventService.getPokemonDetails(url).then((response) => response.data)
      return result
    },
    getPokemonById(id) {
      const result = EventService.getPokemonById(id).then((response) => response.data)
      return result
    },
    async setPokemonSpecies(url) {
      const species = await this.getPokemonDetails(url)

      this.pokemon.is_legendary = species.is_legendary
      this.pokemon.is_mythical = species.is_mythical

      this.setEvolutionChain(species.evolution_chain.url)
    },
    async setEvolutionChain(url) {
      const evolutionChain = await this.getPokemonDetails(url)
      console.log(evolutionChain)

      try {
        const first = await this.getPokemonDetails(evolutionChain.chain.species.url)
        const first_details = await this.getPokemonById(first.id)

        this.pokemon.evolution_base = first_details
        console.log(first)
      } catch (error) {
        this.pokemon.evolution_base = this.pokemon
      }

      try {
        const second = await this.getPokemonDetails(
          evolutionChain.chain.evolves_to[0].species.url
        )
        const second_details = await this.getPokemonById(second.id)

        this.pokemon.evolution_advanced = second_details
      } catch (error) {
        this.pokemon.evolution_advanced = null
      }

      try {
        const third = await this.getPokemonDetails(
          evolutionChain.chain.evolves_to[0].evolves_to[0].species.url
        )
        const third_details = await this.getPokemonById(third.id)

        this.pokemon.evolution_expert = third_details
      } catch (error) {
        this.pokemon.evolution_expert = null
      }

      console.log(this.pokemon)
    },
  },
  computed: {
    createBackgroundString() {
      const type1 = this.types[this.pokemon.types[0].type.name]
      const type2 = this.types[this.pokemon.types[1].type.name]
      return `background: linear-gradient(133deg, ${type1} 50%, ${type2} 50%`
    },
    createMainBackground() {
      const type = this.types[this.pokemon.types[0].type.name]
      return `background-color: ${type} `
    },
  },
}
</script>

<style lang="scss" scoped>
.rectangle {
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  display: flex;
  flex-direction: column;
}

.img {
  align-self: center;
  width: 200px;
  height: 200px;
}
.poke-name {
  text-align: center;
  h3 {
    margin: 8px;
    font-size: 1.75rem;
    color: #fff;
    text-shadow: 1px 1px 1px black, 1px -1px 1px black, -1px 1px 1px black,
      -1px -1px 1px black;
  }
}
</style>

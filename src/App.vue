<template>
  <div class="container">
    <div class="grid">
      <Pokemon
        v-for="pokemon in pokemons"
        :key="pokemon.details.id"
        :pokemon="pokemon"
        @show-modal-data="showModalData(pokemon)"
      />
    </div>
  </div>

  <Teleport to="body">
    <modal :show="showModal" @close="showModal = false">
      <template #img>
        <img :src="pokemon.sprites.front_default" class="detail-img" />
      </template>
      <template #body>
        <div class="poke-details">
          <div class="detail-keys list-style-none">
            <ul>
              <li>Name</li>
              <li>No.</li>
              <li>Type(s)</li>
              <li>Height</li>
              <li>Weight</li>
              <li>Abilities</li>
            </ul>
          </div>
          <div class="detail-values list-style-none">
            <ul>
              <li>{{ pokemon.name }}</li>
              <li>{{ pokemon.id }}</li>
              <li>
                {{ pokemon.types[0].type.name
                }}<span v-if="pokemon.types[1]">/{{ pokemon.types[1].type.name }}</span>
              </li>
              <li>{{ pokemon.height }}</li>
              <li>{{ pokemon.weight }}</li>
              <li>
                {{ pokemon.abilities[0].ability.name
                }}<span v-if="pokemon.abilities[1]"
                  >, {{ pokemon.abilities[1].ability.name }}</span
                >
                <span v-if="pokemon.abilities[2]"
                  >, {{ pokemon.abilities[2].ability.name }}</span
                >
                <span v-if="pokemon.abilities[3]"
                  >, {{ pokemon.abilities[3].ability.name }}</span
                >
              </li>
            </ul>
          </div>
        </div>
      </template>
    </modal>
  </Teleport>
</template>
<script>
import Pokemon from './components/Pokemon.vue'
import EventService from './services/EventService'
import Modal from './components/Modal.vue'

export default {
  components: {
    Pokemon,
    Modal,
  },
  data: () => ({
    pokemons: [],
    showModal: false,
    pokemon: [],
    offset: 0,
    count: 50,
    scrollLoad: 50,
  }),
  methods: {
    showModalData(pokemonDO) {
      this.showModal = true
      this.pokemon = pokemonDO.details
      console.log(this.pokemon)
    },
    getPokemonNames(count, offset) {
      EventService.getPokemonNames(count, offset)
        .then((response) => {
          const pokemons = response.data.results
          for (const data of pokemons) {
            EventService.getPokemonDetails(data.url).then((response) => {
              const details = response.data
              const pushPokemonDetails = () => {
                this.pokemons.push({details})
              }
              setTimeout(pushPokemonDetails, 1500)
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getNextPokemons() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight
        if (bottomOfWindow) {
          this.offset += this.scrollLoad
          this.getPokemonNames(this.count, this.offset)
        }
      }
    },
  },
  beforeMount() {
    this.getPokemonNames(this.count, this.offset)
  },
  mounted() {
    this.getNextPokemons()
  },
}
</script>

<style lang="scss">
.container {
  width: 80vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  padding-top: 4rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 250px));
  gap: 4rem;
  justify-content: center;
}

.img {
  align-self: center;
  width: 200px;
  height: 200px;
}
</style>

<template>
  <div class="container">
    <div class="grid">
      <Pokemon
        v-for="pokemon in pokemons"
        :key="pokemon.id"
        :pokemon="pokemon"
        @show-modal-data="showModalData(pokemon)"
      />
    </div>
  </div>

  <Teleport to="body">
    <modal :show="showModal" @close="showModal = false">
      <template #img>
        <img :src="pokemon.sprites.front_default" class="detail-img" />
        <img :src="pokemon.sprites.front_shiny" class="detail-img" />
      </template>
      <template #body>
        <div class="poke-details">
          <div class="detail-keys list-style-none">
            <ul>
              <li>Name</li>
              <li>No.</li>
              <li>Type's</li>
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
    pokemon: [],
    showModal: false,
    offset: 0,
    count: 150,
    scrollLoad: 50,
  }),
  watch: {
    showModal() {
      this.showModal
        ? (document.body.style.overflow = 'hidden')
        : (document.body.style.overflow = 'auto')
    },
  },
  methods: {
    showModalData(pokemon) {
      this.showModal = true
      this.pokemon = pokemon
    },
    getPokemonNames(count, offset) {
      if (this.pokemons.length >= 1126) {
        return
      }

      EventService.getPokemonNames(count, offset)
        .then((response) => {
          const pokemons = response.data.results
          async function processData() {
            const pokeDetails = []
            for (const data of pokemons) {
              await EventService.getPokemonDetails(data.url).then((response) => {
                const details = response.data
                pokeDetails.push(details)
              })
            }
            return pokeDetails.sort((a, b) => a.id - b.id)
          }
          return processData()
        })
        .then((data) => {
          this.pokemons.push(...data)
          console.log(this.pokemons)
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

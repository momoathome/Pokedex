<template>
  <main class="container">
    <label for="pokemon" class="pokemonSearch">
      <input type="text" id="pokemonSearch" v-model="search" placeholder="&nbsp;" />
      <span class="label">Search Pokemon</span>
      <span class="focus-bg"></span>
    </label>
    <div class="grid">
      <Pokemon
        v-for="pokemon in filteredPokemon"
        :key="pokemon.id"
        :pokemon="pokemon"
        @show-modal-data="showModalData(pokemon)"
      />
    </div>
  </main>

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
    count: 151,
    scrollLoad: 100,
    search: '',
  }),
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
          this.getPokemonNames(this.scrollLoad, this.pokemons.length)
        }
      }
    },
  },
  computed: {
    filteredPokemon() {
      return this.pokemons.filter((poke) => {
        return poke.name.toLowerCase().indexOf(this.search.toLowerCase()) != -1
      })
    },
  },
  beforeMount() {
    this.getPokemonNames(this.count, this.offset)
  },
  mounted() {
    this.getNextPokemons()
  },
  watch: {
    showModal() {
      this.showModal
        ? (document.body.style.overflow = 'hidden')
        : (document.body.style.overflow = 'auto')
    },
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

$primary: #000080;
$dark: #000;

.pokemonSearch {
  position: relative;
  margin: 0 auto 3rem auto;
  width: 100%;
  max-width: 500px;
  border-radius: 3px;
  overflow: hidden;

  .label {
    position: absolute;
    top: 20px;
    left: 12px;
    font-size: 16px;
    color: rgba($dark, 0.5);
    font-weight: 500;
    transform-origin: 0 0;
    transform: translate3d(0, 0, 0);
    transition: all 0.2s ease;
    pointer-events: none;
  }

  .focus-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($dark, 0.05);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: left;
  }

  input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    border: 0;
    font-family: inherit;
    padding: 16px 12px 0 12px;
    height: 56px;
    font-size: 16px;
    font-weight: 400;
    background: rgba($dark, 0.02);
    box-shadow: inset 0 -1px 0 rgba($dark, 0.3);
    color: $dark;
    transition: all 0.15s ease;

    &:hover {
      background: rgba($dark, 0.04);
      box-shadow: inset 0 -1px 0 rgba($dark, 0.5);
    }

    &:not(:placeholder-shown) {
      .label {
        color: rgba($dark, 0.5);
        transform: translate3d(0, -12px, 0) scale(0.75);
      }
    }

    &:focus {
      background: rgba($dark, 0.05);
      outline: none;
      box-shadow: inset 0 -2px 0 $primary;
      + .label {
        color: $primary;
        transform: translate3d(0, -12px, 0) scale(0.75);
      }
      + .focus-bg {
        transform: scaleX(1);
        transition: all 0.1s ease;
      }
    }
  }
}
</style>

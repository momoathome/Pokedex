<template>
  <main class="container">
    <label for="pokemon" class="pokemonSearch">
      <input type="text" id="pokemonSearch" v-model="search" placeholder="&nbsp;" />
      <span class="label">Search Pokemon ({{ pokemons.length }}) </span>
      <span class="focus-bg"></span>
    </label>

    <div class="grid">
      <Pokemon
        v-for="pokemon in filteredPokemon"
        :key="pokemon.id"
        :pokemon="pokemon"
        @show-modal-data="showModalData(pokemon)"
      />

      <Skeleton v-if="isCallingApi" v-for="index in scrollLoad" :key="index" />
    </div>

    <ButtonToTop />
  </main>

  <Teleport to="body">
    <modal :show="showModal" @close="showModal = false">
      <template #img>
        <div class="modal-img">
          <div class="modal-img-inner">
            <div class="poke-front">
              <img :src="pokemon.sprites.front_default" class="detail-img" />
            </div>
            <div class="poke-back">
              <img :src="pokemon.sprites.front_shiny" class="detail-img" />
            </div>
          </div>
        </div>
      </template>
      <template #body>
        <div class="modal-details">
          <div class="detail-keys list-style-none">
            <ul>
              <li>Name</li>
              <li>No.</li>
              <li>Type's</li>
              <li v-if="pokemon.is_legendary || pokemon.is_mythical">State</li>
              <li>Height</li>
              <li>Weight</li>
              <li>Abilities</li>
            </ul>
          </div>
          <div class="detail-values list-style-none">
            <ul>
              <li>
                {{ pokemon.name }}
              </li>
              <li>{{ pokemon.id }}</li>
              <li>
                <span class="poke-type" :class="pokemon.types[0].type.name">
                  {{ pokemon.types[0].type.name }}
                </span>
                <span
                  v-if="pokemon.types[1]"
                  class="poke-type"
                  :class="pokemon.types[1].type.name"
                >
                  {{ pokemon.types[1].type.name }}
                </span>
              </li>
              <li v-if="pokemon.is_legendary">Legendary</li>
              <li v-if="pokemon.is_mythical">Mythical</li>
              <li class="to-lower-case">{{ pokemon.height / 10 }} m</li>
              <li class="to-lower-case">{{ pokemon.weight / 10 }} kg</li>
              <li>
                {{ pokemon.abilities[0].ability.name
                }}<span v-if="pokemon.abilities[1]"
                  >,
                  {{ pokemon.abilities[1].ability.name }}
                </span>
                <span v-if="pokemon.abilities[2]"
                  >,
                  {{ pokemon.abilities[2].ability.name }}
                </span>
                <br />
                <span v-if="pokemon.abilities[3]"
                  >,
                  {{ pokemon.abilities[3].ability.name }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="evolution-chain">
          <div v-if="pokemon.evolution_base">
            <img
              :src="pokemon.evolution_base.sprites.front_default"
              class="evolution-img"
            />
            <p>{{ pokemon.evolution_base.name }}</p>
          </div>
          <template v-if="pokemon.evolution_advanced">
            <EvolutionArrow />
          </template>
          <div v-if="pokemon.evolution_advanced">
            <img
              :src="pokemon.evolution_advanced.sprites.front_default"
              class="evolution-img"
            />
            <p>{{ pokemon.evolution_advanced.name }}</p>
          </div>
          <template v-if="pokemon.evolution_expert">
            <EvolutionArrow />
          </template>
          <div v-if="pokemon.evolution_expert">
            <img
              :src="pokemon.evolution_expert.sprites.front_default"
              class="evolution-img"
            />
            <p>{{ pokemon.evolution_expert.name }}</p>
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
import Skeleton from './components/Skeleton.vue'
import ButtonToTop from './components/ButtonToTop.vue'
import EvolutionArrow from './components/EvolutionArrow.vue'

export default {
  components: {
    Pokemon,
    Modal,
    Skeleton,
    ButtonToTop,
    EvolutionArrow,
  },
  data: () => ({
    pokemons: [],
    pokemon: [],
    pokeAbilitys: [],
    showModal: false,
    isCallingApi: true,
    count: 50,
    scrollLoad: 25,
    search: '',
  }),
  methods: {
    showModalData(pokemon) {
      this.pokemon = pokemon
      this.showModal = true
      //console.log(this.pokemons)
    },
    getPokemonNames(count, offset) {
      if (this.pokemons.length >= 1126) {
        return
      }
      // One time after first 151 Pokekom (generation 1) get 1 fewer to fill the line in the Grid
      if (this.pokemons.length === this.count && this.count === 151) {
        count = count - 1
      }

      // show Skeleton loading animation during Api call
      this.isCallingApi = true
      const pokeDetails = []
      const abilitys = this.pokeAbilitys

      // get Pokemon Data
      EventService.getPokemonData(count, offset)
        .then((response) => {
          const pokemons = response.data.results

          async function waitForPokeDetails() {
            for (const data of pokemons) {
              await EventService.getPokemonDetails(data.url)
                .then((response) => {
                  const details = response.data
                  pokeDetails.push(details)
                  return details
                })
                .then((data) => {
                  for (const index in data.abilities) {
                    const name = data.abilities[index].ability.name

                    const found = abilitys.find((element) => element.name == name)

                    if (!found) {
                      async function pokeAbilitys() {
                        await EventService.getPokemonDetails(
                          data.abilities[index].ability.url
                        ).then((response) => {
                          let abilityDesc
                          //console.log(response.data)

                          let entry = response.data.effect_entries
                          if (entry[1].language.name == 'en') {
                            entry = entry[1]
                          } else {
                            entry = entry[0]
                          }

                          if (entry) {
                            abilityDesc = entry.short_effect
                          }
                          if (!entry) {
                            abilityDesc = response.data.flavor_text_entries[7].flavor_text
                          } else {
                            abilityDesc = entry.effect
                          }

                          data.abilities[index].desc = abilityDesc
                          abilitys.push({name: name, desc: abilityDesc})
                        })
                      }

                      pokeAbilitys()
                    } else {
                      const description = abilitys.find((element) => element.name == name)
                      //console.log(description)
                      data.abilities[index].desc = description.desc
                    }
                  }
                })
            }
            return pokeDetails.sort((a, b) => a.id - b.id)
          }

          return waitForPokeDetails()
        })
        .then((data) => {
          this.pokemons.push(...data)
          this.isCallingApi = false
        })

        .catch((error) => {
          //console.log(error)
        })
    },
    getNextPokemons() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 2000
        if (bottomOfWindow && !this.search && !this.isCallingApi) {
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
    this.getPokemonNames(this.count, 0)
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
.content {
  margin-bottom: 4rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  gap: 4rem;
  justify-content: center;
  margin-bottom: 4rem;
}

.img {
  align-self: center;
  width: 200px;
  height: 200px;
}

.to-lower-case {
  text-transform: lowercase;
}

.loading {
  margin-top: 4rem;
}

$primary: #800000;
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

.poke-type {
  padding-inline: 0.5rem;
  border: 1px solid black;
  color: white;
  font-size: 1rem;
  text-transform: lowercase;
  text-shadow: 1px 1px 1px black, 1px -1px 1px black, -1px 1px 1px black,
    -1px -1px 1px black;

  &:first-of-type {
    margin-right: 0.5rem;
  }
}

.normal {
  background-color: #a8a77a;
}
.fire {
  background-color: #ee8130;
}
.water {
  background-color: #6390f0;
}
.electric {
  background-color: #f7d02c;
}
.grass {
  background-color: #7ac74c;
}
.ice {
  background-color: #96d9d6;
}
.fighting {
  background-color: #c22e28;
}
.poison {
  background-color: #a33ea1;
}
.ground {
  background-color: #e2bf65;
}
.flying {
  background-color: #a98ff3;
}
.psychic {
  background-color: #f95587;
}
.bug {
  background-color: #a6b91a;
}
.rock {
  background-color: #b6a136;
}
.ghost {
  background-color: #735797;
}
.dragon {
  background-color: #6f35fc;
}
.dark {
  background-color: #705746;
}
.steel {
  background-color: #b7b7ce;
}
.fairy {
  background-color: #d685ad;
}
</style>

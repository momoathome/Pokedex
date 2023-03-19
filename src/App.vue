<template>
  <div class="searchbar">
    <div class="inner-search">
      <label for="pokemon" class="pokemonSearch">
        <input type="text" id="pokemonSearch" v-model="search" placeholder="&nbsp;" />
        <span class="label">
          <img class="search-lens" :src="'assets/magnifying-glass-solid.svg'" alt="" />Search Pokemon ({{ pokemons.length }})
        </span>
        <span class="focus-bg"></span>
      </label>
    </div>
  </div>

  <main class="container">
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

  <Teleport to="#modal">
    <div v-if="showModal" class="modal-mask">
      <modal @close="showModal = false" :pokeTypes="hexTypes" :pokemon="pokemon"></modal>
    </div>
  </Teleport>
</template>
<script>
import Pokemon from './components/Pokemon.vue'
import EventService from './services/EventService'
import Modal from './components/Modal.vue'
import Skeleton from './components/Skeleton.vue'
import ButtonToTop from './components/ButtonToTop.vue'

export default {
  components: {
    Pokemon,
    Modal,
    Skeleton,
    ButtonToTop,
  },
  data: () => ({
    pokemons: [],
    pokemon: [],
    pokeAbilitys: [],
    hexTypes: [],
    showModal: false,
    isCallingApi: true,
    count: 151,
    scrollLoad: 50,
    language: 'en',
    search: '',
  }),
  methods: {
    showModalData(pokemon) {
      this.pokemon = pokemon
      this.hexTypes = this.pokemon.types[0].type.hex
      this.showModal = true
      //console.log(this.pokemons)
    },
    getPokemons(count, offset) {
      // No new API calls after "max Pokemon count" in API Data
      if (this.pokemons.length >= 1281) {
        return
      }
      // One time after first 151 Pokekom (generation 1) get 1 fewer to fill the line in the Grid
      if (this.pokemons.length === this.count && this.count === 151) {
        count = count - 1
      }

      // show Skeleton loading animation during Api call
      this.isCallingApi = true

      // get Pokemon Data
      EventService.getPokemonData(count, offset)
        .then((response) => {
          const pokemons = response.data.results
          return this.getPokeDetails(pokemons)
        })
        .then((data) => {
          // End result - by ID sorted Pokemon array with Details, and ability Names + Description
          this.pokemons.push(...data)
          this.isCallingApi = false
          this.setPokemonName()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getPokeDetails(pokemons) {
      const pokeDetails = []

      const waitForPokeDetails = async () => {
        for (const data of pokemons) {
          await EventService.getPokemonDetails(data.url)
            .then((response) => {
              pokeDetails.push(response.data)
              return response.data
            })
            .then((data) => {
              this.getPokemonSpecies(data)
              this.getPokemonAbilityDescription(data)
            })
        }
        // sort pokemons with added details - according to pokemon ID
        return pokeDetails.sort((a, b) => a.id - b.id)
      }
      return waitForPokeDetails()
    },
    async getPokemonSpecies(data) {
      // prettier-ignore
      const species = await EventService.getPokemonDetails(data.species.url).then((response) => response.data)
      // adds all names to the Pokemon Object
      data.names = species.names
    },
    getPokemonAbilityDescription(data) {
      //console.log(data)

      for (const index in data.abilities) {
        const abilityName = data.abilities[index].ability.name

        // checks if the ability from the pokemon was already fetcht
        const found = this.pokeAbilitys.find((element) => element.name == abilityName)

        // if ability was not already fetcht, fetches the ability Name and Description - New API call
        if (!found) {
          const pokeAbilitys = async () => {
            await EventService.getPokemonDetails(data.abilities[index].ability.url)
              // prettier-ignore
              .then((response) => {
                data.abilities[index].names = response.data.names

                let abilityDesc
                //console.log(response.data)

                // finds the Ability Description equal to this.language
                // if existing and if the short Description is existing - uses the short Description
                // else uses the "normal Description"
                if (response.data.effect_entries.length > 0) {
                  let entry = response.data.effect_entries
                  //console.log(entry)

                  if (entry[0] && entry[0].language.name == this.language) {
                    entry = entry[0]
                  } else if (entry[1] && entry[1].language.name == this.language) {
                    entry = entry[1]
                  } else {
                    entry = entry[0]
                  }

                  if (entry.short_effect) {
                    abilityDesc = entry.short_effect
                  } else abilityDesc = entry.effect

                  // else uses the flavor text - that is also a english Ability Description
                } else if(response.data.effect_entries.length <= 0) {
                  abilityDesc = "no ability description"
                } else abilityDesc = response.data.flavor_text_entries[7].flavor_text


                // Sets the AbilityDesc in the Pokemon Objekt, to the corresponding Ability
                data.abilities[index].desc = abilityDesc
                // pushes the Ability and the Desc to the "search" Array -
                // if the Ability is needed once more, we don't need to fetch the Ability name & desc again
                this.pokeAbilitys.push({name: abilityName, desc: abilityDesc})
              })
          }

          pokeAbilitys()

          // if ability was already fetcht, sets the Description from the array - No new API call
        } else {
          // prettier-ignore
          const description = this.pokeAbilitys.find((element) => element.name == abilityName)
          //console.log(description)
          data.abilities[index].desc = description.desc
        }
      }
    },
    setPokemonName() {

      for (const pokemon of this.pokemons) {
        if (pokemon.names !== undefined) {
        const newPokemonName = pokemon.names.find((poke) => poke.language.name == this.language)
        pokemon.name = newPokemonName.name
        } 
      }
    },
    setAbilityDisplayName() {
      for (const pokemon of this.pokemons) {
        const newAbilityDisplayName = pokemon.abilities.find(
          (poke) => poke.language.name == this.language
        )
        pokemon.ability_display_name = newAbilityDisplayName.name
      }
    },
    getNextPokemons() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 2500
        if (bottomOfWindow && !this.search && !this.isCallingApi) {
          this.getPokemons(this.scrollLoad, this.pokemons.length)
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
    this.getPokemons(this.count, 0)
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

.to-lower-case {
  text-transform: lowercase;
}

.loading {
  margin-top: 4rem;
}


/* Searchbar */
$primary: rgb(128, 0, 0);
$dark: rgb(0, 0, 0);
$background: rgb(255, 255, 255);

.searchbar {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 9999;
  margin-bottom: 6.5rem;
  background-color: $background;
  box-shadow: 0 2px 16px 2px rgba(0, 0, 0, 0.1);

  .inner-search {
    display: flex;
    justify-content: center;
  }

  .search-lens {
    width: 16px;
    height: 16px;
  }

  .pokemonSearch {
    position: relative;
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
      z-index: -1;
      transform: scaleX(0);
      transform-origin: left;
    }

    input {
      -webkit-appearance: none;
      appearance: none;
      width: 500px;
      border: 0;
      font-family: inherit;
      padding: 16px 12px 0 12px;
      height: 56px;
      font-size: 16px;
      font-weight: 400;
      color: $dark;
      transition: all 0.15s ease;

      &:not(:placeholder-shown) {
        .label {
          color: rgba($dark, 0.5);
          transform: translate3d(0, -12px, 0) scale(0.75);
        }
      }

      &:focus {
        outline: none;
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

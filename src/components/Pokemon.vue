<template>
  <div class="poke-card" @click="showModal(pokemon)" :style="createMainBackground">
    <div class="poke-head">
      <div class="poke-name">
        <h3 v-if="pokemon.id < 10000">{{ pokemon.name }}</h3>
        <h3 v-else class="pokemon-name-small">{{ pokemon.name }}</h3>
        <span class="poke-id">No.{{ pokemon.id }}</span>
      </div>
      <div class="poke-head-info">
        <div class="poke-kp">{{ pokemon.stats[0].base_stat }} <span>KP</span></div>
        <div class="poke-element-icon">
          <img :src="'assets/' + setElementIcon" alt="" />
        </div>
      </div>
    </div>

    <div class="poke-body">
      <div class="poke-img">
        <img :src="pokemon.sprites.front_default" class="img" />
      </div>
    </div>

    <div class="poke-footer">
      <div class="poke-details">
        <span>Height: {{ pokemon.height / 10 }}m </span>,<span
          >Weight: {{ pokemon.weight / 10 }}kg
        </span>
      </div>
      <div class="poke-abilities">
        <div class="poke-ability">
          {{ pokemon.abilities[0].ability.name }}
          <span v-if="pokemon.abilities[0].desc" class="poke-ability-desc"
            >{{ shortenDescription(0) }}
          </span>
        </div>
        <div class="poke-ability" v-if="pokemon.abilities[1]">
          {{ pokemon.abilities[1].ability.name }}
          <span v-if="pokemon.abilities[1].desc" class="poke-ability-desc"
            >{{ shortenDescription(1) }}
          </span>
        </div>
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
    descriptionLength: 10,
    types: {
      normal: ['#b8c6db', '#f5f7fa'],
      fire: ['#a40606', '#d98324'],
      water: ['#2a2a72', '#009ffd'],
      electric: ['#fbb034', '#ffdd00'],
      grass: ['#0fd64f', '#98de5b'],
      ice: ['#48dbfb', '#a4bfef'],
      fighting: ['#eeeeee', '#ec4534'],
      poison: ['#5f0a87', '#a4508b'],
      ground: ['#ff4e00', '#ec9f05'],
      flying: ['#ddbdfc', '#96c8fb'],
      psychic: ['#726cf8', '#e975a8'],
      bug: ['#0bab64', '#3bb78f'],
      rock: ['#772f1a', '#f2a65a'],
      ghost: ['#7f5a83', '#0d324d'],
      dragon: ['#6d17cb', '#2876f9'],
      dark: ['#28313b', '#485461'],
      steel: ['#d2ccc4', '#2f4353'],
      fairy: ['#d387ab', '#e899dc'],
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

      try {
        const first = await this.getPokemonDetails(evolutionChain.chain.species.url)
        const first_details = await this.getPokemonById(first.id)

        this.pokemon.evolution_base = first_details
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
    shortenDescription(index) {
      const description = this.pokemon.abilities[index].desc

      //console.log(description)
      const words = description
        .split(' ')
        .filter((el) => el !== '\n')
        .filter((word) => word !== '')

      if (words.length > this.descriptionLength) {
        const newDesc = words.slice(0, this.descriptionLength).join(' ') + '...'
        //console.log(newDesc)
        return newDesc
      } else {
        return description
      }
    },
  },
  computed: {
    createMainBackground() {
      const type = this.types[this.pokemon.types[0].type.name]
      this.pokemon.types[0].type.hex = type
      return `background: linear-gradient(315deg, ${type[0]} 0%, ${type[1]} 74%)`
    },
    setElementIcon() {
      const type = this.pokemon.types[0].type.name
      return `Pokemon_${type}_Type_Icon.svg`
    },
  },
}
</script>

<style lang="scss">
.poke-card {
  cursor: pointer;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  display: flex;
  flex-direction: column;
  height: 475px;
  width: 300px;
  border: 12px solid;
  border-image-source: linear-gradient(245deg, #bcc6cc, #eee, #bcc6cc);
  border-image-slice: 80 20;
  padding-inline: 1.5rem;
}

.poke-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0.25rem;
}
.poke-name {
  text-align: start;
  margin-top: 1rem;
  display: flex;
  max-width: 155px;

  h3 {
    max-width: 110px;
    margin: 0;
    font-size: 1rem;
    color: #fff;
    text-shadow: 1px 1px 1px black, 1px -1px 1px black, -1px 1px 1px black,
      -1px -1px 1px black;
  }

  .pokemon-name-small {
    max-width: 100px;
    margin: 0;
    font-size: 0.9rem;
    color: #fff;
    text-shadow: 1px 1px 1px black, 1px -1px 1px black, -1px 1px 1px black,
      -1px -1px 1px black;
  }
  .poke-id {
    font-size: 0.6rem;
    font-weight: bold;
    align-self: flex-end;
    margin-left: 0.25rem;
  }
  .poke-id-small {
    font-size: 0.5rem;
    font-weight: bold;
    align-self: flex-end;
    margin-left: 0.25rem;
  }
}
.poke-head-info {
  display: flex;
}
.poke-kp {
  color: #000;
  font-weight: bold;
  margin-right: 0.25rem;
  align-self: flex-end;

  span {
    margin-left: -7px;
  }
}
.poke-element-icon {
  height: 22px;
  width: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  &::before {
    content: '';
    position: absolute;
    height: 22px;
    width: 22px;
    background: linear-gradient(#ffffff 0%, #ffffff 60%, #ffffff 100%);
    border-radius: 50%;
    filter: blur(18px);
    z-index: 1;
  }

  img {
    height: 22px;
    width: 22px;
    perspective: 1200px;
    perspective-origin: 50% 50%;
  }
}

.poke-body {
  display: flex;
  justify-content: center;
}
.poke-img {
  display: flex;
  justify-content: center;
  border: 6px solid;
  border-image-source: linear-gradient(
    255deg,
    #bf953f,
    #fcf6ba,
    #b38728,
    #fbf5b7,
    #aa771c
  );
  border-image-slice: 80 20;
  background-color: #000;
  width: 100%;
  height: auto;
  box-shadow: rgba(0, 0, 0, 0.24) 6px 6px 6px;
}
.img {
  width: 200px;
  height: 200px;
}
.poke-footer {
  display: flex;
  flex-direction: column;
}
.poke-details {
  width: 93%;
  display: flex;
  justify-content: center;
  align-self: center;
  font-size: 11.5px;
  font-weight: bold;
  padding-block: 4px;
  background: linear-gradient(135deg, #bf953f, #fcf6ba, #aa771c);
  margin-top: 2px;
  clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
}

.poke-abilities {
  margin-block: 0.75rem;
  font-weight: bold;

  .poke-ability:first-of-type {
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  }
}

.poke-ability-desc {
  font-size: 0.7rem;
  font-weight: normal;
}
</style>

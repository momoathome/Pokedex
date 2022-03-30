<template>
  <div>
    <div
      class="rectangle"
      @click="showModal(pokemon)"
      :class="pokemon.details.types[0].type.name"
      :style="pokemon.details.types[1] ? createBackgroundString : ''"
    >
      <img :src="pokemon.details.sprites.front_default" class="img" />
      <div class="poke-name">
        <h3>{{ pokemon.details.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pokemon',
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
  props: {
    pokemon: Object,
  },
  methods: {
    showModal(pokemonDO) {
      this.$emit('show-modal-data', pokemonDO)
    },
  },
  computed: {
    createBackgroundString() {
      const typeColor = []
      for (const type in this.types) {
        if (this.pokemon.details.types[0].type.name === type) {
          typeColor.push(this.types[type])
        }
      }
      for (const type in this.types) {
        if (this.pokemon.details.types[1].type.name === type) {
          typeColor.push(this.types[type])
        }
      }
      return `background: linear-gradient(133deg, ${typeColor[0]} 50%, ${typeColor[1]} 50%`
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

.clip {
  clip-path: polygon(100% 0, 0% 100%, 100% 100%);
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

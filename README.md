# Pokedex

## What is this?
In This Project I used Vue.js with Vite and the Pokemon API https://pokeapi.co/ to build a "Pokedex"

Live: https://momoathome.github.io/Pokedex/

## How does it work?

On initialization the Api is called and is getting us, a from us defined amount of Objects (Pokemons) back
These Objects contain an individual link to the Object-(Pokemon)details: like Name, Height, Weight, Abilities, Types etc.

We call the link in an async for loop to retrieve the Pokemon Details
Which are then ordered and displayed in Pokemon card form in a grid

On click of a Pokemon card, a modal opens with the individual Pokemon Details of the clicked Pokemon

## What you see

You see Pokemon cards in a grid, where the Background of the crad, is the color of the type from the Pokemon. Displayed in a Linear Gradient

An Image and the Name of the Pokemon, aswell as the Poke KP, the Poke type, Ability Names and the Ability Descriptions

## But Why?

I wanted to learn more about Vue.js and i learned many things in this Project

- Setting up a Vue Project with Vite
- installing the needed dependencies, like Axios and Sass with Vite
- deeper understanding of the Vue options Api
- working with an unknown Api, learn it's difficulties and possibilities
- creating an asynchronous for loop, calling and waiting for the API call with axios
- established my CSS skill and understanding of Vue.js

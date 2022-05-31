# Pokedex

In This Project I used Vue.JS with Vite and the Pokemon API https://pokeapi.co/ to build a "Pokedex"

Live: https://momoathome.github.io/Pokedex/

## How it works

On initialization the Api is called and getting us, a from us defined amount of Objects back

These Objects contain a individual link to the Pokemon details

We call the link in an async for loop to retrieve the Pokemon Details

Which are then ordered and displayed in a grid

## What you see

You see a Pokemon Card, where the Background is the color of the Element from the Pokemon

An Image and the Name of the Pokemon, aswell as Ability Names and the Ability Descriptions

## Modal

If you click on a Pokemon you will see a Modal with detailed Information about the clicked Pokemon
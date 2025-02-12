
async function fetchEvolutionChain() {
  const pokemonNameOrId = document.querySelector(".pokemon-input").value.toLowerCase();
  const evolutionChainContainer = document.querySelector(".evolution-chain");
  evolutionChainContainer.innerHTML = "";
  
  try {
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonNameOrId}/`);
      const speciesData = await speciesResponse.json();
      const evolutionUrl = speciesData.evolution_chain.url;
      
      const evolutionResponse = await fetch(evolutionUrl);
      const evolutionData = await evolutionResponse.json();
      
      displayEvolutionChain(evolutionData.chain);
  } catch (error) {
      evolutionChainContainer.innerHTML = `<p style='color:red;'>Pokemon not found</p>`;
  }
}

function displayEvolutionChain(chain) {
  const evolutionChainContainer = document.querySelector(".evolution-chain");
  const evolutionTree = document.createElement("div");
  evolutionTree.classList.add("evolution-tree");
  
  function createEvolutionElement(pokemon) {
      const div = document.createElement("div");
      div.classList.add("pokemon");
      
      const img = document.createElement("img");
      img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
      img.alt = pokemon.name;
      
      const name = document.createElement("span");
      name.textContent = pokemon.name;
      
      div.appendChild(img);
      div.appendChild(name);
      return div;
  }
  
  async function traverseEvolutionChain(chain) {
      if (!chain) return;
      const pokemonName = chain.species.name;
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/`);
      const pokemonData = await pokemonResponse.json();
      
      const evolutionElement = createEvolutionElement({ id: pokemonData.id, name: pokemonData.name });
      evolutionTree.appendChild(evolutionElement);
      
      if (chain.evolves_to.length > 0) {
          for (const nextEvolution of chain.evolves_to) {
              await traverseEvolutionChain(nextEvolution);
          }
      }
  }
  
  traverseEvolutionChain(chain);
  evolutionChainContainer.appendChild(evolutionTree);
}

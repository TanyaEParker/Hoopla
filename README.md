# Hoopla Digital Technical Test.



Hi there! Thank you for giving me the opportunity to work on this technical test. It's been a really fun test.



#### Installation Instructions


I've used vite as a bundler so kick it off with:

cd/ \[your filepath]/hoopla/

npm install pixi.js

npm install @pixi/sound

npm run dev



it should mount the build at http://localhost:5173/hoopla/



#### 

Hopefully everything should be self explanatory. Though there's two elements that I think need some explaining



the Firework component takes in a perlin noise texture that ends up not being used. I was going to apply that as an alpha mask and animated it to make the firework asset shimmer. Ended up scrapping it as the firework wasn't on screen long enough for it to be beneficial



the EvolutionRope component is mostly unused, as I wanted to wiggle the whiteout masks to make the transition between basic and evolved more intricate but again, I'm happy with how the transition looks without it. 



I'd debated adding some of the pixi post-processing stack, but it felt like rearranging deck chairs on the titanic so I've decided to down tools here.


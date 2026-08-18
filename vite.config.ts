import { defineConfig } from 'vite'

export default defineConfig({
  base: "/hoopla/",
  optimizeDeps:{
    include:['pixi.js', '@pixi/sound']
  }
})

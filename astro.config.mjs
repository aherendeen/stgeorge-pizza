// @ts-no-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";
import playformInline from "@playform/inline";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
	site: "https://st-george-pizza.vercel.app",
	base: "/",
	// trailingSlash: 'always',
	integrations: [
		alpinejs(),
		playformInline({
			Beasties: true,
		}),
		mdx(),
	],
	output: "static",
	vite: {
		plugins: [tailwindcss()],
	},
});

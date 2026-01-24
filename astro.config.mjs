// @ts-no-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";
import playformInline from "@playform/inline";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";

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
		icon({
			include: {
				lucide: ["*"],
			},
		}),
	],
	output: "static",
	vite: {
		plugins: [tailwindcss()],
	},
});
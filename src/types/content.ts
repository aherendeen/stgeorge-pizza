/// <reference path="../../.astro/content.d.ts" />
import type { CollectionEntry } from "astro:content";

// Keep PlateItem available for components that want the nested item shape
export type PlateItem = {
  name: string;
  description: string;
  price: number;
};

// Alias to Astro's generated CollectionEntry types so we don't duplicate the schema
export type Plate = CollectionEntry<"plates">;
export type Gallery = CollectionEntry<"gallery">;
export type Review = CollectionEntry<"reviews">;

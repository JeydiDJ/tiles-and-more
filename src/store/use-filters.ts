"use client";

import { useState } from "react";

type CatalogFiltersState = {
  query: string;
  category: string;
  brand: string;
  material: string;
  finish: string;
  application: string;
};

const defaultFilters: CatalogFiltersState = {
  query: "",
  category: "all",
  brand: "all",
  material: "all",
  finish: "all",
  application: "all",
};

export function useFilters(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [material, setMaterial] = useState("all");
  const [finish, setFinish] = useState("all");
  const [application, setApplication] = useState("all");

  function resetFilters() {
    setQuery(initialQuery);
    setCategory(defaultFilters.category);
    setBrand(defaultFilters.brand);
    setMaterial(defaultFilters.material);
    setFinish(defaultFilters.finish);
    setApplication(defaultFilters.application);
  }

  return {
    query,
    setQuery,
    category,
    setCategory,
    brand,
    setBrand,
    material,
    setMaterial,
    finish,
    setFinish,
    application,
    setApplication,
    resetFilters,
  };
}

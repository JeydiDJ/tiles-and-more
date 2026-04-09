"use client";

import { useState } from "react";

export function useFilters() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  return { query, setQuery, category, setCategory };
}

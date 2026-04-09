"use client";

import { useState } from "react";

export function useCart() {
  const [items, setItems] = useState<string[]>([]);

  function addItem(id: string) {
    setItems((current) => [...current, id]);
  }

  return { items, addItem, count: items.length };
}

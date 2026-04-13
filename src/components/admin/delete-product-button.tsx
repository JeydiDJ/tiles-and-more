"use client";

import { useActionState } from "react";
import { deleteProductAction, type ProductDeleteState } from "@/app/(admin)/admin/products/actions";

type DeleteProductButtonProps = {
  productId: string;
};

const initialState: ProductDeleteState = {
  error: null,
};

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [state, formAction, isPending] = useActionState(deleteProductAction, initialState);

  return (
    <form action={formAction} className="flex items-center gap-3">
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        disabled={isPending}
        className="text-xs font-medium uppercase tracking-[0.16em] text-[#b42318] transition hover:text-[#7a1b14] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
      {state.error ? <span className="text-xs text-[#b42318]">{state.error}</span> : null}
    </form>
  );
}

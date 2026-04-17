"use client";

import { useActionState, useState } from "react";
import { deleteProductAction, type ProductDeleteState } from "@/app/(admin)/admin/products/actions";
import { Modal } from "@/components/ui/modal";

type DeleteProductButtonProps = {
  productId: string;
  productName?: string;
};

const initialState: ProductDeleteState = {
  error: null,
};

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [state, formAction, isPending] = useActionState(deleteProductAction, initialState);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium uppercase tracking-[0.16em] text-[#b42318] transition hover:text-[#7a1b14] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Delete
      </button>
      <Modal
        open={open}
        onClose={() => (isPending ? null : setOpen(false))}
        title="Delete product?"
        description={
          productName
            ? `This will permanently remove ${productName} from the catalog. This action cannot be undone.`
            : "This will permanently remove this product from the catalog. This action cannot be undone."
        }
      >
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="productId" value={productId} />
          {state.error ? <p className="text-sm text-[#b42318]">{state.error}</p> : null}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-sm border border-[var(--border)] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#231f20] transition hover:border-[#231f20]/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-sm bg-[#b42318] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[#7a1b14] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Deleting..." : "Delete Product"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

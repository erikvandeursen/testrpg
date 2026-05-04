import { useEffect } from "react";
import { create } from "zustand";

type ToastType = "success" | "error" | "info";
type Toast = { id: string; message: string; type: ToastType };

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "success") =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message, type }],
    })),
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const DISMISS_MS = 3000;

const colors: Record<ToastType, string> = {
  success: "bg-green-700",
  error: "bg-red-700",
  info: "bg-blue-700",
};

function ToastItem({ id, message, type }: Toast) {
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), DISMISS_MS);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <div
      data-testid="toast"
      data-toast-type={type}
      className={`${colors[type]} px-4 py-3 rounded shadow-lg text-white text-sm font-medium min-w-[220px]`}
    >
      {message}
    </div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div
      data-testid="toast-container"
      className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}

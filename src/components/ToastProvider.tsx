import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Toaster } from "sonner";

export default function ToastConfig() {
  return (
    <Toaster
      position="bottom-right"
      icons={{
        success: <CheckCircleIcon className="size-6 text-emerald-500" />,
        error: <XCircleIcon className="size-6 text-destructive" />,
        warning: <ExclamationCircleIcon className="size-6 text-amber-500" />,
        loading: <ArrowPathIcon className="size-6 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group pointer-events-auto relative flex w-full items-start gap-3 rounded-xl border border-border bg-muted text-foreground shadow-lg",
          icon: "mt-0.5",
          content: "grid gap-1",
          title: "text-sm font-semibold",
          description: "text-sm text-muted-foreground",
          actionButton:
            "rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground hover:opacity-90",
          cancelButton:
            "rounded-md border border-border px-3 py-1 text-sm text-foreground hover:bg-muted",
          closeButton:
            "absolute right-2 top-2 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100",
        },
      }}
    />
  );
}

import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Toaster } from 'sonner';

export default function ToastConfig() {
  return (
    <Toaster
      position="top-right"
      icons={{
        success: <CheckCircleIcon className="size-6 text-green-400" />,
        error: <XCircleIcon className="size-6 text-red-400" />,
        warning: <ExclamationCircleIcon className="size-6 text-yellow-500" />,
        loading: <ArrowPathIcon className="size-6 text-white" />,
      }}
      toastOptions={{
        style: {
          marginTop: '3rem',
          borderRadius: '0.5rem',
          gap: '1rem',
          fontSize: '14px',
        },
        classNames: {
          toast: 'p-4 hover:p-4 bg-gray-500 text-white',
          icon: 'text-gray-500',
          loading: 'p-4 hover:p-4',
          description: 'text-gray-500',
          closeButton:
            'absolute top-2 left-auto right-2 border-none text-gray-400 scale-125 hover:bg-transparent hover:text-gray-600 hover:scale-150 !important',
        },
      }}
    />
  );
}

import { AlertCircle, CheckCircle, X } from "lucide-react";

interface FormAlertProps {
  type: "error" | "success";
  message: string;
  onClose?: () => void;
}

export function FormAlert({ type, message, onClose }: FormAlertProps) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border mb-6 animate-in slide-in-from-top-2 ${
      isError 
        ? "bg-red-500/10 border-red-500/50 text-red-200" 
        : "bg-green-500/10 border-green-500/50 text-green-200"
    }`}>
      {isError ? <AlertCircle className="w-5 h-5 shrink-0 text-red-500" /> : <CheckCircle className="w-5 h-5 shrink-0 text-green-500" />}
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
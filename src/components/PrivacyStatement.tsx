import { Lock } from "lucide-react";

export const PrivacyStatement = () => {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
      <Lock className="h-4 w-4" />
      <p>Your documents are processed in-memory and never stored.</p>
    </div>
  );
};

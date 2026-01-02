import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIGenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  tooltip?: string;
  size?: "sm" | "default" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
}

export function AIGenerateButton({
  onClick,
  isGenerating,
  tooltip = "Generate with AI",
  size = "icon",
  variant = "ghost",
  className,
}: AIGenerateButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size={size}
            variant={variant}
            onClick={onClick}
            disabled={isGenerating}
            className={className}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isGenerating ? "Generating..." : tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

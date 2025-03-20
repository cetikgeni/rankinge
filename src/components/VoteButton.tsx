
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ThumbsUp } from 'lucide-react';

interface VoteButtonProps {
  isVoted: boolean;
  isLoggedIn: boolean;
  onVote: () => void;
  size?: 'default' | 'sm';
}

const VoteButton = ({ isVoted, isLoggedIn, onVote, size = 'default' }: VoteButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleVote = () => {
    if (!isLoggedIn) return;
    
    setIsAnimating(true);
    onVote();
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  if (!isLoggedIn) {
    return (
      <Button 
        variant="outline" 
        size={size} 
        disabled 
        className="w-full md:w-auto text-sm"
      >
        <ThumbsUp className="h-4 w-4 mr-2" />
        Login to vote
      </Button>
    );
  }

  return (
    <Button
      variant={isVoted ? "default" : "outline"}
      size={size}
      onClick={handleVote}
      className={`w-full md:w-auto transition-all ${
        isVoted 
          ? 'bg-brand-green hover:bg-brand-green/90 text-white' 
          : 'hover:border-brand-green hover:text-brand-green'
      } ${isAnimating ? 'animate-vote-pulse' : ''}`}
    >
      {isVoted ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Voted
        </>
      ) : (
        <>
          <ThumbsUp className="h-4 w-4 mr-2" />
          Vote
        </>
      )}
    </Button>
  );
};

export default VoteButton;

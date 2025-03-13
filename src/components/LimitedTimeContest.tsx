
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, Trophy, ArrowRight, Medal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getApprovedCategories } from '@/lib/data';
import { Category } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  maxSeconds: number;
}

const CountdownTimer = ({ timeLeft }: { timeLeft: TimeLeft }) => {
  // Calculate progress percentage for the timer
  const progressPercentage = Math.max(0, 100 - (timeLeft.totalSeconds / timeLeft.maxSeconds * 100));
  
  return (
    <div className="flex flex-col w-full">
      <div className="flex space-x-4 mt-4 md:mt-0 justify-center md:justify-start">
        <div className="text-center">
          <div className="bg-brand-purple text-white text-lg font-bold rounded-md h-12 w-12 flex items-center justify-center">{timeLeft.days}</div>
          <div className="text-xs mt-1">Days</div>
        </div>
        <div className="text-center">
          <div className="bg-brand-purple text-white text-lg font-bold rounded-md h-12 w-12 flex items-center justify-center">{timeLeft.hours}</div>
          <div className="text-xs mt-1">Hours</div>
        </div>
        <div className="text-center">
          <div className="bg-brand-purple text-white text-lg font-bold rounded-md h-12 w-12 flex items-center justify-center">{timeLeft.minutes}</div>
          <div className="text-xs mt-1">Mins</div>
        </div>
        <div className="text-center">
          <div className="bg-brand-purple text-white text-lg font-bold rounded-md h-12 w-12 flex items-center justify-center">{timeLeft.seconds}</div>
          <div className="text-xs mt-1">Secs</div>
        </div>
      </div>
      
      {/* Progress bar for visual representation of time left */}
      <div className="mt-4 w-full">
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Contest started</span>
          <span>Contest ends</span>
        </div>
      </div>
    </div>
  );
};

const LimitedTimeContest = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    maxSeconds: 7 * 24 * 60 * 60 // 7 days in seconds
  });
  
  // For demo purposes, we'll use the first category from our data
  const contestCategory: Category = getApprovedCategories()[0];
  
  // Set end date to 7 days from now for demo
  useEffect(() => {
    const calculateTimeLeft = () => {
      // Set contest end date to 7 days from now (for demo purposes)
      const contestEndDate = new Date();
      contestEndDate.setDate(contestEndDate.getDate() + 7);
      
      const difference = contestEndDate.getTime() - new Date().getTime();
      const maxSeconds = 7 * 24 * 60 * 60; // 7 days in seconds
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        const totalSeconds = Math.floor(difference / 1000);
        
        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          totalSeconds,
          maxSeconds
        });
      }
    };
    
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    
    return () => clearInterval(timer);
  }, []);
  
  // Sort items by vote count (descending)
  const sortedItems = [...contestCategory.items].sort((a, b) => b.voteCount - a.voteCount);
  
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-brand-purple/5 to-brand-teal/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Limited-Time Contest</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Vote for your favorite {contestCategory.name} to win the trophy! The winner will be featured on our homepage.</p>
          
          <div className="mt-6 inline-flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 w-full max-w-md">
            <div className="flex flex-col md:flex-row items-center w-full">
              <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                <Timer className="h-5 w-5 text-brand-purple mr-2" />
                <span className="text-gray-700 font-medium">Contest ends in:</span>
              </div>
              <CountdownTimer timeLeft={timeLeft} />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {sortedItems.slice(0, 3).map((item, index) => {
            // Colors for top 3 positions
            const colors = [
              "from-yellow-300 to-yellow-500 border-yellow-400", // Gold
              "from-gray-300 to-gray-400 border-gray-400",      // Silver
              "from-amber-600 to-amber-700 border-amber-500"    // Bronze
            ];
            
            // Medal icons for top 3
            const medals = [
              <Trophy key="gold" className="h-6 w-6 text-yellow-500" />, 
              <Medal key="silver" className="h-6 w-6 text-gray-500" />,
              <Medal key="bronze" className="h-6 w-6 text-amber-500" />
            ];
            
            return (
              <Card key={item.id} className={`overflow-hidden relative h-full border-2 ${index < 3 ? colors[index] : ''} bg-gradient-to-br`}>
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-white font-bold">
                    {['🥇 1st', '🥈 2nd', '🥉 3rd'][index]} Place
                  </Badge>
                </div>
                <div className="relative h-40">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-bold text-lg">{item.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{item.voteCount} votes</span>
                    {medals[index]}
                  </div>
                  <p className="text-sm mt-2 line-clamp-2">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button asChild className="bg-brand-purple hover:bg-brand-purple/90">
            <Link to={`/categories/${contestCategory.id}`}>
              Vote Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LimitedTimeContest;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trophy, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getApprovedCategories } from '@/lib/data';
import { Category } from '@/lib/types';

const LimitedTimeContest = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
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
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60)
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Limited-Time Contest: {contestCategory.name}</h2>
            <p className="text-gray-600">Vote for your favorite to win the trophy! Contest ends in:</p>
          </div>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {sortedItems.slice(0, 3).map((item, index) => {
            // Colors for top 3 positions
            const colors = [
              "from-yellow-300 to-yellow-500 border-yellow-400", // Gold
              "from-gray-300 to-gray-400 border-gray-400",      // Silver
              "from-amber-600 to-amber-700 border-amber-500"    // Bronze
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
                    {index === 0 && (
                      <Trophy className="h-6 w-6 text-yellow-500" />
                    )}
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


import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Check, ThumbsUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { getApprovedCategories } from '@/lib/data';
import { getAllCategoryIcons } from '@/lib/category-icons';
import CategorySearch from '@/components/CategorySearch';
import SponsoredSection from '@/components/SponsoredSection';
import LimitedTimeContest from '@/components/LimitedTimeContest';

const Index = () => {
  // Get the first 8 categories to display (increased from 4 to 8)
  const featuredCategories = getApprovedCategories().slice(0, 8);
  const allCategoryIcons = getAllCategoryIcons();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-brand-purple/5 to-brand-teal/5">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand-purple to-brand-teal bg-clip-text text-transparent">
            Vote for your favorites, worldwide
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Categlorium lets you vote on the best products, brands, and more across thousands of categories. Discover what's popular and add your voice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-brand-purple hover:bg-brand-purple/90">
              <Link to="/categories">Browse Categories</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/submit">Submit New Category</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sponsored Products Section */}
      <SponsoredSection />
      
      {/* Limited Time Contest Section */}
      <LimitedTimeContest />
      
      {/* Categories Search & Browse Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Browse All Categories</h2>
          
          {/* Search Box */}
          <div className="mb-10">
            <CategorySearch />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {allCategoryIcons.map((categoryGroup) => (
              <div key={categoryGroup.name} className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                  <categoryGroup.icon className="mr-2 h-5 w-5 text-brand-purple" />
                  {categoryGroup.name}
                </h3>
                <ul className="space-y-2">
                  {categoryGroup.subcategories.slice(0, 6).map((subCategory) => (
                    <li key={subCategory.name}>
                      <Link 
                        to={`/categories?filter=${subCategory.name.toLowerCase()}`}
                        className="text-gray-600 hover:text-brand-purple transition-colors flex items-center text-sm"
                      >
                        <subCategory.icon className="mr-2 h-4 w-4 text-gray-400" />
                        {subCategory.name}
                      </Link>
                    </li>
                  ))}
                  {categoryGroup.subcategories.length > 6 && (
                    <li className="pt-1">
                      <Link 
                        to={`/categories?group=${categoryGroup.name.toLowerCase()}`}
                        className="text-brand-purple hover:text-brand-purple/80 text-sm font-medium"
                      >
                        + {categoryGroup.subcategories.length - 6} more
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Categories - Expanded from 4 to 8 */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
            <Link 
              to="/categories" 
              className="text-brand-purple hover:text-brand-purple/80 flex items-center text-sm font-medium"
            >
              View all categories
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">How Categlorium Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-brand-purple/10 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <ThumbsUp className="h-6 w-6 text-brand-purple" />
                </div>
                <h3 className="text-lg font-bold mb-2">Vote on Categories</h3>
                <p className="text-gray-600">
                  Cast your vote on thousands of items across different categories. One vote per category ensures fairness.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-brand-purple/10 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-brand-purple" />
                </div>
                <h3 className="text-lg font-bold mb-2">View Rankings</h3>
                <p className="text-gray-600">
                  See real-time results and discover which items are most popular among users worldwide.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="bg-brand-purple/10 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-brand-purple" />
                </div>
                <h3 className="text-lg font-bold mb-2">Submit Categories</h3>
                <p className="text-gray-600">
                  Don't see what you're looking for? Suggest new categories and items for others to vote on.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-purple to-brand-teal text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start voting?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of users and help determine the best in every category.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-brand-purple hover:bg-gray-100">
            <Link to="/categories">Start Exploring</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BarChart3 className="h-5 w-5 text-brand-teal" />
              <span className="text-lg font-bold text-white">Categlorium</span>
            </div>
            <div className="text-sm">
              &copy; {new Date().getFullYear()} Categlorium. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

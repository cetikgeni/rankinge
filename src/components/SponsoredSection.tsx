
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAllCategoryIcons } from '@/lib/category-icons';
import { getApprovedCategories } from '@/lib/data';
interface CategoryGroupProps {
  title: string;
  categoryGroup: string;
  showImages?: boolean;
  limit?: number;
}

// The CategoryGroup component shows categories by group name
export const CategoryGroup = ({
  title,
  categoryGroup,
  showImages = false,
  limit = 4
}: CategoryGroupProps) => {
  const allCategoryIcons = getAllCategoryIcons();
  const groupData = allCategoryIcons.find(group => group.name === categoryGroup);
  if (!groupData) return null;
  const categories = getApprovedCategories().filter(cat => {
    // Match category to subcategory names in the group
    return groupData.subcategories.some(sub => cat.name.toLowerCase().includes(sub.name.toLowerCase()) || sub.name.toLowerCase().includes(cat.name.toLowerCase()));
  }).slice(0, limit);
  return;
};

// Create and export the AdCard component for CategoryDetails.tsx
export const AdCard = ({
  title,
  description,
  imageUrl,
  link
}) => {
  return <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="h-40 overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Link to={link} className="text-brand-purple hover:text-brand-purple/80 flex items-center text-sm font-medium">
          Learn more
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>;
};

export default CategoryGroup;

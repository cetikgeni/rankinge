import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getAllCategoryIcons } from '@/lib/category-icons';
import { getApprovedCategories } from '@/lib/data';
import CategoryCard from '@/components/CategoryCard';
interface CategoryGroupProps {
  title: string;
  categoryGroup: string;
  showImages?: boolean;
  limit?: number;
}

// The CategoryGroup component shows categories by group name
const CategoryGroup = ({
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
export default CategoryGroup;
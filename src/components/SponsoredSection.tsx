
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const AdCard = ({
  title,
  description,
  imageUrl,
  link
}: {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}) => {
  return <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="h-40 overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Link to={link} className="text-brand-green hover:text-brand-green/80 flex items-center text-sm font-medium">
          Learn more
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>;
};

export default AdCard;

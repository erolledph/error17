import React from 'react';
import { ExternalLink, DollarSign, Calendar, Globe } from 'lucide-react';
import { Offer } from '../types/api';

interface OfferCardProps {
  offer: Offer;
  onSelect: (offer: Offer) => void;
  selected: boolean;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onSelect, selected }) => {
  const getCommissionText = () => {
    if (offer.commissions && offer.commissions.length > 0) {
      return offer.commissions[0].Commission;
    }
    return 'Contact advertiser';
  };

  return (
    <div
      onClick={() => onSelect(offer)}
      className={`relative bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
        selected 
          ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {offer.logo && (
              <img
                src={offer.logo}
                alt={offer.offer_name}
                className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {offer.offer_name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {offer.description || 'No description available'}
            </p>
          </div>
          {selected && (
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="font-medium text-emerald-600">{getCommissionText()}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="w-4 h-4 mr-1" />
              <span>{offer.countries}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                {offer.lookup_value.toUpperCase()}
              </span>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md">
                {offer.categories}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              <span>ID: {offer.offer_id}</span>
            </div>
          </div>

          {offer.preview_url && (
            <a
              href={offer.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Preview Site
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
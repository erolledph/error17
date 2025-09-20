import React, { useState, useEffect } from 'react';
import { Search, Filter, LogOut, RefreshCw, Grid, List } from 'lucide-react';
import { Offer, GeneratedLink } from '../types/api';
import { involveAsiaAPI } from '../services/api';
import { OfferCard } from './OfferCard';
import { DeeplinkForm } from './DeeplinkForm';

interface DashboardProps {
  onLogout: () => void;
}

const categories = [
  'All', 'Electronics', 'Fashion', 'Finance', 'Health & Beauty', 
  'Marketplace', 'Travel', 'Services', 'Others'
];

const countries = [
  'All', 'Malaysia', 'Singapore', 'Indonesia', 'Thailand', 
  'Philippines', 'Vietnam', 'International'
];

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    filterOffers();
  }, [offers, searchTerm, selectedCategory, selectedCountry]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await involveAsiaAPI.fetchOffers({
        limit: 100,
        page: 1,
      });
      setOffers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const filterOffers = () => {
    let filtered = [...offers];

    if (searchTerm) {
      filtered = filtered.filter(offer => 
        offer.offer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(offer => 
        offer.categories.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (selectedCountry !== 'All') {
      filtered = filtered.filter(offer => 
        offer.countries.toLowerCase().includes(selectedCountry.toLowerCase())
      );
    }

    setFilteredOffers(filtered);
  };

  const handleGenerateLinks = async (urls: string[], affSubs: any) => {
    if (!selectedOffer) return;

    try {
      setGenerating(true);
      const newLinks: GeneratedLink[] = [];

      for (const url of urls) {
        const request = {
          offer_id: selectedOffer.offer_id,
          url,
          ...Object.fromEntries(
            Object.entries(affSubs).filter(([, value]) => value && value.trim())
          )
        };

        const result = await involveAsiaAPI.generateDeeplink(request);
        newLinks.push({
          ...result,
          original_url: url,
          generated_at: new Date().toISOString(),
          aff_subs: affSubs
        });
      }

      setGeneratedLinks(prev => [...newLinks, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate deeplinks');
    } finally {
      setGenerating(false);
    }
  };

  const handleLogout = () => {
    involveAsiaAPI.logout();
    setOffers([]);
    setFilteredOffers([]);
    setSelectedOffer(null);
    setGeneratedLinks([]);
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Deeplink Generator</h1>
              <span className="text-sm text-gray-500">
                {filteredOffers.length} offer{filteredOffers.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchOffers}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh offers"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Offers Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search offers..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Offers Grid */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchOffers}
                  className="mt-2 text-red-700 hover:text-red-900 underline"
                >
                  Try again
                </button>
              </div>
            )}

            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2' 
                : 'grid-cols-1'
            }`}>
              {filteredOffers.map(offer => (
                <OfferCard
                  key={offer.offer_id}
                  offer={offer}
                  selected={selectedOffer?.offer_id === offer.offer_id}
                  onSelect={setSelectedOffer}
                />
              ))}
            </div>

            {filteredOffers.length === 0 && !loading && (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Deeplink Generation Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Deeplinks</h2>
              {selectedOffer ? (
                <DeeplinkForm
                  selectedOffer={selectedOffer}
                  onGenerateLink={handleGenerateLinks}
                  generatedLinks={generatedLinks}
                  loading={generating}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">Select an offer to start generating deeplinks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
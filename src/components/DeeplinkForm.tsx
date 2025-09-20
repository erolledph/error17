import React, { useState } from 'react';
import { Link2, Plus, Trash2, Copy, ExternalLink } from 'lucide-react';
import { Offer, GeneratedLink } from '../types/api';

interface DeeplinkFormProps {
  selectedOffer: Offer;
  onGenerateLink: (urls: string[], affSubs: any) => Promise<void>;
  generatedLinks: GeneratedLink[];
  loading: boolean;
}

interface UrlInput {
  id: string;
  url: string;
}

export const DeeplinkForm: React.FC<DeeplinkFormProps> = ({
  selectedOffer,
  onGenerateLink,
  generatedLinks,
  loading,
}) => {
  const [urlInputs, setUrlInputs] = useState<UrlInput[]>([
    { id: '1', url: '' }
  ]);
  const [affSubs, setAffSubs] = useState({
    aff_sub: '',
    aff_sub2: '',
    aff_sub3: '',
    aff_sub4: '',
    aff_sub5: '',
  });

  const addUrlInput = () => {
    const newId = Date.now().toString();
    setUrlInputs(prev => [...prev, { id: newId, url: '' }]);
  };

  const removeUrlInput = (id: string) => {
    if (urlInputs.length > 1) {
      setUrlInputs(prev => prev.filter(input => input.id !== id));
    }
  };

  const updateUrlInput = (id: string, url: string) => {
    setUrlInputs(prev => prev.map(input => 
      input.id === id ? { ...input, url } : input
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = urlInputs.map(input => input.url.trim()).filter(url => url);
    if (urls.length > 0) {
      await onGenerateLink(urls, affSubs);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const validUrls = urlInputs.filter(input => input.url.trim()).length;

  return (
    <div className="space-y-6">
      {/* Selected Offer Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          {selectedOffer.logo && (
            <img
              src={selectedOffer.logo}
              alt={selectedOffer.offer_name}
              className="w-10 h-10 rounded-lg object-cover bg-white"
            />
          )}
          <div>
            <h3 className="font-semibold text-blue-900">{selectedOffer.offer_name}</h3>
            <p className="text-sm text-blue-700">Offer ID: {selectedOffer.offer_id}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Inputs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Destination URLs
          </label>
          <div className="space-y-3">
            {urlInputs.map((input, index) => (
              <div key={input.id} className="flex space-x-2">
                <div className="flex-1 relative">
                  <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={input.url}
                    onChange={(e) => updateUrlInput(input.id, e.target.value)}
                    placeholder="https://example.com/product-page"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                {urlInputs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrlInput(input.id)}
                    className="px-3 py-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addUrlInput}
            className="mt-3 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add another URL</span>
          </button>
        </div>

        {/* Affiliate Sub Parameters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Affiliate Sub Parameters (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(affSubs).map(([key, value]) => (
              <input
                key={key}
                type="text"
                value={value}
                onChange={(e) => setAffSubs(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={`${key.replace('_', ' ').toUpperCase()}`}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={validUrls === 0 || loading}
          className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-emerald-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Link2 className="w-5 h-5" />
              <span>Generate {validUrls > 1 ? `${validUrls} ` : ''}Deeplink{validUrls > 1 ? 's' : ''}</span>
            </>
          )}
        </button>
      </form>

      {/* Generated Links */}
      {generatedLinks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Generated Links</h3>
          <div className="space-y-3">
            {generatedLinks.map((link, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {link.offer_name} #{index + 1}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(link.generated_at).toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Original URL:</p>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-sm bg-white px-3 py-2 rounded-lg border text-gray-800 break-all">
                        {link.original_url}
                      </code>
                      <a
                        href={link.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Tracking Link:</p>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-sm bg-white px-3 py-2 rounded-lg border text-emerald-700 font-medium break-all">
                        {link.tracking_link}
                      </code>
                      <button
                        onClick={() => copyToClipboard(link.tracking_link)}
                        className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={link.tracking_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Calendar, Tag, ArrowLeft, ExternalLink, Share2 } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import { formatCurrency } from '../lib/utils';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPropertyById, loading } = useProperties();
  const { isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [buyLoading, setBuyLoading] = useState(false);

  const property = getPropertyById(id || '');

  const handleBuyProperty = async () => {
    if (!isConnected) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to purchase this property.',
        variant: 'warning'
      });
      return;
    }

    setBuyLoading(true);
    try {
      // Mock purchase transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Purchase Initiated',
        description: 'Your transaction has been submitted to the blockchain.',
        variant: 'success'
      });
      
      // Redirect to dashboard after purchase
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      toast({
        title: 'Transaction Failed',
        description: 'There was an error processing your transaction.',
        variant: 'destructive'
      });
    } finally {
      setBuyLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this property: ${property?.title}`,
        url: window.location.href,
      }).catch(err => {
        toast({
          title: 'Share Failed',
          description: 'Could not share this property.',
          variant: 'destructive'
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Property link copied to clipboard.',
        variant: 'success'
      });
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Property Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The property you're looking for doesn't exist or has been removed.
        </p>
        <Button variant="primary" onClick={() => navigate('/properties')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
      </div>
    );
  }

  const statusColors = {
    forSale: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    sold: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  const statusLabels = {
    forSale: 'For Sale',
    pending: 'Pending',
    sold: 'Sold'
  };

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 mb-6 group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Gallery */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
            <img
              src={property.images[activeImageIndex]}
              alt={property.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            
            {/* Status Badge */}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${statusColors[property.status]}`}>
              {statusLabels[property.status]}
            </div>
          </div>
          
          {/* Thumbnails */}
          {property.images.length > 1 && (
            <div className="flex mt-4 gap-4 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                    index === activeImageIndex ? 'ring-2 ring-primary-500' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={image} alt={`${property.title} - view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Property Details & Actions */}
        <div className="space-y-8">
          {/* Basic Info */}
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {property.title}
              </h1>
              <button 
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                aria-label="Share property"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-2 flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.location}</span>
            </div>
            
            <div className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(property.price)}
            </div>
          </div>
          
          {/* Actions */}
          {property.status === 'forSale' && (
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleBuyProperty}
                isLoading={buyLoading}
              >
                Buy Now
              </Button>
              
              {!isConnected && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={connectWallet}
                >
                  Connect Wallet to Buy
                </Button>
              )}
            </div>
          )}
          
          {/* Features */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Property Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{property.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{property.area} sq ft</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Built {property.yearBuilt}</span>
              </div>
            </div>
          </div>
          
          {/* Blockchain Info */}
          {property.tokenId && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Blockchain Information</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Tag className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">Token ID:</span>
                    <div className="text-gray-600 dark:text-gray-400 text-sm font-mono break-all">
                      {property.tokenId}
                    </div>
                  </div>
                </div>
                <div>
                  <a
                    href={`https://etherscan.io/token/${property.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 text-sm flex items-center hover:underline"
                  >
                    View on Etherscan
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Description */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About This Property</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300">
            {property.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
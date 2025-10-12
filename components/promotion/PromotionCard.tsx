import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import { PromotionCard as PromotionCardType } from '@/types/promotion';

interface PromotionCardProps {
  card: PromotionCardType;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  card,
}) => {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        <Image
          src={card.image}
          alt={card.title}
          width={400}
          height={192}
          className="w-full h-48 object-cover"
        />
        {card.isNews && (
          <Badge 
            className="absolute top-3 right-3 bg-red-500 hover:bg-red-500"
            variant="destructive"
          >
            News
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {card.title}
            </h3>
            {/* <div className="flex items-center space-x-1 ml-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="text-blue-500 hover:text-blue-500 hover:bg-blue-100 p-1 h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-500 hover:text-red-500 hover:bg-red-100 p-1 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div> */}
          </div>

          <p className="text-sm text-gray-600 line-clamp-3">
            {card.description}
          </p>

          {card.ctaTitle && card.link && (
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => window.open(card.link, '_blank')}
            >
              {card.ctaTitle}
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionCard;

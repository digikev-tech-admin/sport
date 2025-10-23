import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Edit, Trash2, ChevronRight, Check } from 'lucide-react';
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
    <Card className="bg-yellow-400 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl border-0">
      <CardContent className="p-0">
        <div className="flex h-48">
          {/* Left Section - Text Content */}
          <div className="flex-1 flex flex-col justify-between p-4 pr-8 max-w-[70%]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800 leading-tight">
                  {card.title}
                </h3>
                {/* {card.isNews && (
                  <Badge 
                    className="bg-red-500 hover:bg-red-500 text-white text-xs px-2 py-1"
                    variant="destructive"
                  >
                    News
                  </Badge>
                )} */}
              </div>
              
              <p className="text-sm text-gray-700 leading-relaxed max-w-full">
                {card.description}
              </p>
            </div>

            <div className="space-y-3">
              {card.ctaTitle && card.link && (
                <Button
                  className="bg-white text-gray-800 hover:bg-gray-50 border-0 rounded-xl px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 w-fit"
                  onClick={() => window.open(card.link, '_blank')}
                >
                  {card.ctaTitle}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Right Section - Circular Image Container */}
          <div className="w-30 flex items-center justify-center pr-6">
            <div className="relative">
              {/* Circular white container */}
              <div className="w-32 h-32  rounded-xl  overflow-hidden relative ">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover object-center"
                />
              </div>
              
              {/* Blue checkmark overlay */}
              {/* <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <Check className="h-4 w-4 text-white" />
              </div> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionCard;

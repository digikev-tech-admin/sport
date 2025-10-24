import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, Clock, Eye } from 'lucide-react';
import PromotionCard from './PromotionCard';
import { PromotionGroup as PromotionGroupType } from '@/types/promotion';
import Link from 'next/link';

interface PromotionGroupProps {
  group: PromotionGroupType;
  onEditGroup?: () => void;

}

const PromotionGroup: React.FC<PromotionGroupProps> = ({
  group,
  onEditGroup,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
    <Card className="bg-white shadow-sm cursor-pointer" onClick={() => onEditGroup?.()}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-xl font-semibold">
              Promotion Group
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {formatDate(group.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Updated: {formatDate(group.updatedAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* <Badge variant={group.isActive ? "default" : "secondary"}>
              {group.isActive ? "Active" : "Inactive"}
            </Badge> */}
            <div className="flex items-center space-x-1">
              {onEditGroup && (
                <Link href={`/promotion/editPromotionCard/${group._id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  // onClick={onEditGroup}
                  className="text-blue-500 hover:text-blue-500 hover:bg-blue-100 p-1 h-8 w-8"
                >
                  <Eye className="h-6 w-6" />
                </Button>
                </Link>
              )}
              {/* {onDeleteGroup && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDeleteGroup}
                  className="text-red-500 hover:text-red-500 hover:bg-red-100 p-1 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )} */}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-800">
              Cards ({group.cards.length})
            </h4>
          </div> */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.cards
              .sort((a, b) => a.order - b.order)
              .map((card, index) => (
                <PromotionCard
                  key={`${card.order}-${index}`}
                  card={card}
                />
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default PromotionGroup;

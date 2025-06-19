import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface CouponCardProps {
  title: string;
  discount: number;
  isActive: boolean;
  usedCount: number;
  maxUses: number;
  allowedModule: string;
  onEdit: () => void;
  onDelete: () => void;
}

const CouponCard: React.FC<CouponCardProps> = ({
  title,
  discount,
  isActive,
  usedCount,
  maxUses,
  allowedModule,
  onEdit,
  onDelete,
}) => {
  const usagePercentage = maxUses ? (usedCount / maxUses) * 100 : 0;

  const renderModuleBadges = () => {
    if (allowedModule === 'all') {
      return ['event', 'package', 'resource'].map((module) => (
        <Badge key={module} variant="outline" className="capitalize text-xs">
          {module}
        </Badge>
      ));
    }
    return (
      <Badge variant="outline" className="capitalize">
        {allowedModule}
      </Badge>
    );
  };

  return (
    <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="w-full">
          <div className="flex justify-between items-center mb-3">
          <h3 className="text-2xl font-bold text-primary mb-1">{title}</h3>
          <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            // size="icon"
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-500 flex items-center  p-1 hover:bg-blue-100 rounded-md"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            // size="icon"
            onClick={onDelete }
            className="text-red-500 hover:text-red-500 flex items-center p-1 hover:bg-red-100 rounded-md"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>

          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "success" : "destructive"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
            {renderModuleBadges()}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-primary">
              {discount}%
            </span>
            <span className="text-sm text-gray-500">OFF</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Usage</span>
            <span className="font-medium">
              {usedCount} / {maxUses}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CouponCard;
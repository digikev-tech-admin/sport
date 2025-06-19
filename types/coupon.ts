export type AllowedModule = 'event' | 'package' | 'resource' | 'all';

export interface ICoupon {
  _id?: string;
  code: string;
  discountPercentage: number;
  allowedModule: AllowedModule;
  useFrequency: number;
  validFrom: Date;
  validUntil?: Date;
  isActive: boolean;
  usedCount: number;
  maxUses?: number;
  createdAt?: Date;
  updatedAt?: Date;
}


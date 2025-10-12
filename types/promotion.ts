export interface PromotionCard {
  order: number;
  image: string;
  title: string;
  description: string;
  ctaTitle: string;
  link: string;
  isNews: boolean;
}

export interface PromotionGroup {
  _id: string;
  cards: PromotionCard[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

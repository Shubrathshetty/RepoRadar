export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface Review {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  category?: string;
}

export interface Feedback {
  id: string;
  category: "bug" | "feature" | "general" | "praise";
  rating: number;
  comment: string;
  email?: string;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface RatingStats {
  average: number;
  total: number;
  distribution: Record<RatingValue, number>;
}

export interface HomePageStats {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color: string;
}

export interface HomePageFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

export interface Testimonial {
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  location: string;
}

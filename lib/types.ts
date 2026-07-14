export interface Milestone {
  id: number;
  created_at: string;
  title: string;
  category: string;
  date_achieved: string;
  description: string;
  image_url: string | null;
  is_featured: boolean;
}

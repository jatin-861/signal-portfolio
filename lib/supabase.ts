import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  thumbnail: string;
  video_url: string;
  live_url: string;
  github_url: string;
  featured: boolean;
  order_index: number;
  created_at: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  highlighted: boolean;
  cta_label: string;
  order_index: number;
};

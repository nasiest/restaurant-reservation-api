export interface Reservation {
  id?: number;
  restaurant_id: number;
  table_id: number;
  customer_name: string;
  phone: string;
  party_size: number;
  start_time: Date;
  end_time: Date;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

import request from 'supertest';
import app from '../src/index';
import { query } from '../src/utils/db';
import redis from '../src/utils/redis';

jest.mock('../src/utils/db');
jest.mock('../src/utils/redis');

describe('Reservation API', () => {
  let restaurantId: number;

  // Simulated in-memory reservation table
  const reservations: { tableId: number; start: string; end: string }[] = [];

  // Helper function to simulate table availability
  const mockFindAvailableTable = jest.fn((partySize: number, datetime: string, duration: number) => {
    const requestedStart = new Date(datetime).getTime();
    const requestedEnd = requestedStart + duration * 60 * 60 * 1000;

    // For simplicity, assume one table with capacity >= partySize
    const tableId = 1;

    const overlapping = reservations.some(r => r.tableId === tableId &&
      requestedStart < new Date(r.end).getTime() &&
      requestedEnd > new Date(r.start).getTime()
    );

    return overlapping ? [] : [{ tableId, capacity: 4 }];
  });

  beforeAll(() => {
    (query as jest.Mock).mockImplementation((sql: string, params?: any[]) => {
      if (sql.includes('INSERT INTO restaurants')) {
        return Promise.resolve({ rows: [{ id: 1, name: params?.[0] }] });
      }
      if (sql.includes('INSERT INTO reservations')) {
        const newReservation = { tableId: params?.[2] || 1, start: params?.[3], end: params?.[4] };
        reservations.push(newReservation);
        return Promise.resolve({ rows: [{ id: reservations.length }] });
      }
      if (sql.includes('SELECT')) {
        return Promise.resolve({ rows: mockFindAvailableTable(params?.[0], params?.[1], params?.[2]) });
      }
      return Promise.resolve({ rows: [] });
    });

    (redis.get as jest.Mock).mockResolvedValue(null);
    (redis.set as jest.Mock).mockResolvedValue(null);
  });

  it('creates a restaurant', async () => {
    const res = await request(app)
      .post('/restaurants')
      .send({ name: 'Dynamic Restaurant', openingTime: '10:00', closingTime: '22:00', totalTables: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    restaurantId = res.body.id;
  });

  it('creates a reservation successfully', async () => {
    const res = await request(app)
      .post(`/restaurants/${restaurantId}/reservations`)
      .send({ customerName: 'Alice', phone: '1234567890', partySize: 2, datetime: '2026-01-12T19:00', duration: 2 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('prevents overlapping reservations on the same table dynamically', async () => {
    // Alice already reserved 19:00–21:00
    const res = await request(app)
      .post(`/restaurants/${restaurantId}/reservations`)
      .send({ customerName: 'Bob', phone: '9876543210', partySize: 2, datetime: '2026-01-12T20:00', duration: 2 });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error', 'No available tables at this time');
  });

  it('allows non-overlapping reservations', async () => {
    const res = await request(app)
      .post(`/restaurants/${restaurantId}/reservations`)
      .send({ customerName: 'Charlie', phone: '5555555555', partySize: 2, datetime: '2026-01-12T22:00', duration: 2 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('checks available tables', async () => {
    const res = await request(app).get(`/restaurants/${restaurantId}/available-tables?partySize=2&date=2026-01-12`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

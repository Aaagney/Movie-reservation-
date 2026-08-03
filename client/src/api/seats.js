import client from './client';

export const getSeatMap = (showtimeId) => client.get(`/seats/showtime/${showtimeId}`).then((r) => r.data.data);

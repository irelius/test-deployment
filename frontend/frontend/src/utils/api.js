// frontend/src/utils/api.js

export const fetchUserSpots = async () => {
    const response = await fetch('/api/spots/current', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch spots');
    }
  
    const data = await response.json();
    return data.Spots;
  };
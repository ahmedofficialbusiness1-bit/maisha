import { Game } from '@/components/app/game';

// Mock user for direct access
const mockUser = {
  uid: 'mock-user-01',
  username: 'Mchezaji',
};

export default async function DashboardPage() {
  // Directly render the game with a mock user
  // No validation needed as we removed the authentication flow
  return <Game user={mockUser} />;
}

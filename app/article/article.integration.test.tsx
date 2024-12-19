import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from './page';
import Swal from 'sweetalert2'; // Import SweetAlert2

jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));


describe('Articles Page Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('allows the user to delete an article', async () => {
    // Mock fetch pour charger les articles
    (global.fetch as jest.Mock) = jest.fn((url: string) => {
        if (url.includes('delete')) {
          return Promise.resolve({ ok: true, json: async () => ({}) });
        }
        return Promise.resolve({
          ok: true,
          json: async () => [
            { id: 1, article_name: 'Article 1', current_quantity: 10 },
            { id: 2, article_name: 'Article 2', current_quantity: 15 },
          ],
        });
      });
      
  
    render(<Page />);
  
    // Attendez que les articles soient chargés
    await waitFor(() => screen.getByText('Article 1'));
  
    // Cliquez sur le bouton de suppression
    const deleteButton = screen.getByLabelText('Delete Article 1');
    fireEvent.click(deleteButton);
  
    // Vérifiez que SweetAlert est appelé
    expect(Swal.fire).toHaveBeenCalled();
  
    // Attendez que l'article soit supprimé
    await waitFor(() => expect(screen.queryByText('Article 1')).not.toBeInTheDocument(), { timeout: 3000 });
  });
});

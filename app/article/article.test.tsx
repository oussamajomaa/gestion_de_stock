import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from './page';
import Swal from 'sweetalert2'; // Import SweetAlert2
// Ajoutez une assertion de type pour informer TypeScript que `Swal.fire` est une fonction Jest moquée.

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

const mockedSwal = Swal.fire as jest.Mock;


jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe('Articles Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the list of articles correctly', async () => {
    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          article_name: 'Article 1',
          current_quantity: 10,
          barcode: '12345',
          quantity_min: 5,
          unit: 'kg',
          unit_price: 20,
          category: { category_name: 'Category 1' },
        },
        {
          id: 2,
          article_name: 'Article 2',
          current_quantity: 15,
          barcode: '67890',
          quantity_min: 3,
          unit: 'pcs',
          unit_price: 10,
          category: { category_name: 'Category 2' },
        },
      ],
    });

    render(<Page />);

    // Wait for articles to load
    await waitFor(() => screen.getByText('Article 1'));

    // Verify articles are displayed
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          article_name: 'Article 1',
          current_quantity: 10,
          barcode: '12345',
          quantity_min: 5,
          unit: 'kg',
          unit_price: 20,
          category: { category_name: 'Category 1' },
        },
      ],
    });

    render(<Page />);

    // Wait for articles to load
    await waitFor(() => screen.getByText('Article 1'));

    // Simulate search
    const searchInput = screen.getByPlaceholderText("chercher par nom d'artcile...");
    fireEvent.change(searchInput, { target: { value: 'Article 1' } });

    // Verify search result
    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.queryByText('Article 2')).not.toBeInTheDocument();
  });

  it('handles article deletion', async () => {
    // Mock fetch
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, article_name: 'Article 1', current_quantity: 10 },
        ],
      })
      .mockResolvedValueOnce({ ok: true }); // For delete API call

    // Mock SweetAlert2 confirmation
    const mockedSwal = Swal.fire as jest.Mock;
    mockedSwal.mockResolvedValue({ isConfirmed: true });

    render(<Page />);

    // Wait for articles to load
    await waitFor(() => screen.getByText('Article 1'));

    // Find and click the delete button
    const deleteButton = screen.getByLabelText('Delete Article 1');
    fireEvent.click(deleteButton);

    // Wait for SweetAlert to be called
    expect(mockedSwal).toHaveBeenCalled();

    // Wait for the article to be removed from the table
    await waitFor(() => expect(screen.queryByText('Article 1')).not.toBeInTheDocument());
  });

});

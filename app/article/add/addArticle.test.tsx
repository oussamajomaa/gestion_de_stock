import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Swal from 'sweetalert2';
import Page from './page';

// Mock SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('Ajouter un article', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock fetch pour `/api/category`
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, category_name: 'Catégorie 1' },
          { id: 2, category_name: 'Catégorie 2' },
        ],
      });
  });

  it('affiche correctement les champs et boutons', async () => {
    render(<Page />);

    await waitFor(() => screen.getByText('Ajouter un article'));

    expect(screen.getByText("Ajouter un article")).toBeInTheDocument();
    expect(screen.getByLabelText("Nom de l'article")).toBeInTheDocument();
    expect(screen.getByLabelText('Catégorie')).toBeInTheDocument();
    expect(screen.getByText('Sauvegarder')).toBeInTheDocument();
  });

  it('réagit correctement aux changements dans les champs de formulaire', async () => {
    render(<Page />);

    // Attendre que les catégories soient chargées
    await waitFor(() => screen.getByText('Catégorie 1'));

    const nameInput = screen.getByLabelText("Nom de l'article");
    fireEvent.change(nameInput, { target: { value: 'Nouvel Article' } });

    expect(nameInput).toHaveValue('Nouvel Article');
  });

  it('soumet le formulaire avec succès', async () => {
    // Mock fetch pour le POST à `/api/article`
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, category_name: 'Catégorie 1' },
          { id: 2, category_name: 'Catégorie 2' },
        ],
      })
      .mockResolvedValueOnce({ ok: true }); // Réponse du POST

    render(<Page />);

    // Attendre que les catégories soient chargées
    await waitFor(() => screen.getByText('Catégorie 1'));

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText("Nom de l'article"), { target: { value: 'Nouvel Article' } });
    fireEvent.change(screen.getByLabelText('Catégorie'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Quantité minimale'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Code-barres'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Unité'), { target: { value: 'kg' } });
    fireEvent.change(screen.getByLabelText('Prix unitaire'), { target: { value: '20' } });

    // Soumettre le formulaire
    const submitButton = screen.getByText('Sauvegarder');
    fireEvent.click(submitButton);

    // Vérifier que la requête POST a été appelée avec les bonnes données
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_name: 'Nouvel Article',
          article_description: '',
          barcode: '12345',
          quantity_min: 10,
          unit: 'kg',
          unit_price: 20,
          categoryId: 1,
        }),
      });
    });

    // Vérifier que Swal a été appelé
    expect(Swal.fire).toHaveBeenCalledWith({
      html: `L'article <span style="color: red;">Nouvel Article</span> a été ajouté avec succès !`,
      icon: 'success',
    });
  });

  it('gère une erreur lors de la soumission du formulaire', async () => {
    // Mock fetch pour le POST qui retourne une erreur
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, category_name: 'Catégorie 1' },
        ],
      })
      .mockResolvedValueOnce({ ok: false }); // Réponse du POST avec une erreur

    render(<Page />);

    // Attendre que les catégories soient chargées
    await waitFor(() => screen.getByText('Catégorie 1'));

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText("Nom de l'article"), { target: { value: 'Nouvel Article' } });
    fireEvent.change(screen.getByLabelText('Catégorie'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Quantité minimale'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Code-barres'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('Unité'), { target: { value: 'kg' } });
    fireEvent.change(screen.getByLabelText('Prix unitaire'), { target: { value: '20' } });

    // Soumettre le formulaire
    const submitButton = screen.getByText('Sauvegarder');
    fireEvent.click(submitButton);

    // Vérifier que Swal a été appelé avec une erreur
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        'Erreur',
        "Une erreur est survenue lors de l'ajout d'un article.",
        'error'
      );
    });
  });
});

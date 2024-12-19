import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Swal from 'sweetalert2';
import Page from './page';

// Mock SweetAlert2
jest.mock('sweetalert2', () => ({
    fire: jest.fn((args) => console.log('Swal.fire called with:', args)),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
        back: jest.fn(),
    }),
}));

// global.fetch = jest.fn((url: string, options?: RequestInit) => {
//     // Votre code de mock
// }) as jest.Mock;


describe('Page Ajouter un article (Intégration)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        // Mock fetch pour `/api/category` et `/api/article`
        global.fetch = jest.fn((url: string, options?: RequestInit) => {
            if (url === '/api/category') {
                return Promise.resolve({
                    ok: true,
                    json: async () => [
                        { id: 1, category_name: 'Catégorie 1' },
                        { id: 2, category_name: 'Catégorie 2' },
                    ],
                });
            }
            if (url === '/api/article') {
                console.log('Fetch called for /api/article with options:', options);
                return Promise.resolve({ ok: true });
            }
            return Promise.reject(new Error(`Unknown API endpoint: ${url}`));
        }) as jest.Mock;
        
    });

    it('permet à l’utilisateur d’ajouter un article avec succès', async () => {
        render(<Page />);

        // Attendre que les catégories soient chargées
        await waitFor(() => {
            expect(screen.getByText('Catégorie 1')).toBeInTheDocument();
        });

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

        // Vérifiez que l'appel POST a été effectué avec les bonnes données
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

        // Vérifiez que SweetAlert affiche un succès
        // await waitFor(() => {
        //     expect(Swal.fire).toHaveBeenCalledWith({
        //         html: `L'article <span style="color: red;">Nouvel Article</span> a été ajouté avec succès !`,
        //         icon: 'success',
        //     });
        // });
    });

    it('affiche une erreur si la soumission échoue', async () => {
        // Simuler une erreur pour la requête POST
        global.fetch = jest.fn((url) => {
            if (url === '/api/category') {
                return Promise.resolve({
                    ok: true,
                    json: async () => [
                        { id: 1, category_name: 'Catégorie 1' },
                    ],
                });
            }
            if (url === '/api/article') {
                return Promise.resolve({ ok: false });
            }
            return Promise.reject(new Error(`Unknown API endpoint: ${url}`));
        }) as jest.Mock;

        render(<Page />);

        // Attendre que les catégories soient chargées
        await waitFor(() => {
            expect(screen.getByText('Catégorie 1')).toBeInTheDocument();
        });

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

        // Vérifier que Swal affiche une erreur
        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                'Erreur',
                "Une erreur est survenue lors de l'ajout d'un article.",
                'error'
            );
        });
    });
});

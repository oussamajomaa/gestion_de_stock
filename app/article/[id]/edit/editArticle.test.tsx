import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "@/app/article/[id]/edit/page"; // Chemin correct de la page
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";

// Mock de Next.js
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    useParams: jest.fn(),
}));

// Mock de SweetAlert2
jest.mock("sweetalert2", () => ({
    fire: jest.fn(),
}));

// Mock global de fetch
global.fetch = jest.fn();

describe("Page de mise à jour d'un article", () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
            back: jest.fn(),
        });
        (useParams as jest.Mock).mockReturnValue({ id: "123" });

        (global.fetch as jest.Mock).mockImplementation((url, options) => {
            if (url === "/api/article/123") {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            article_name: "Test Article",
                            article_description: "Description",
                            barcode: "123456",
                            quantity_min: 10,
                            unit: "pcs",
                            unit_price: 100,
                            categoryId: 1,
                        }),
                });
            }
            if (url === "/api/category") {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve([
                            { id: 1, category_name: "Category 1" },
                            { id: 2, category_name: "Category 2" },
                        ]),
                });
            }
            if (options?.method === "PUT") {
                return Promise.resolve({
                    ok: false,
                    status: 500,
                    json: () =>
                        Promise.resolve({ message: "Erreur serveur lors de la mise à jour" }),
                });
            }
            return Promise.reject(new Error("URL non gérée"));
        });
        
        
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Affiche le formulaire prérempli avec les données de l'article", async () => {
        render(<Page />);
    
        // Attendez que le texte "Loading..." disparaisse
        await waitFor(() => {
            expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        });
        
    
        // Vérifiez que les champs sont préremplis avec les bonnes valeurs
        expect(screen.getByLabelText("Nom de l'article")).toHaveValue("Test Article");
        expect(screen.getByLabelText("Description")).toHaveValue("Description");
        expect(screen.getByLabelText("Quantité minimale")).toHaveValue(10);
    });
    

    test("Soumet le formulaire avec succès", async () => {
        render(<Page />);

        // Attendez que le formulaire soit rendu
        await waitFor(() => {
            expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        });

        // Simulez une modification du formulaire
        fireEvent.change(screen.getByLabelText("Nom de l'article"), {
            target: { value: "Updated Article" },
        });

        // Simulez la soumission
        fireEvent.submit(screen.getByRole("button", { name: /Sauvegarder/i }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                "/api/article/123",
                expect.objectContaining({
                    method: "PUT",
                })
            );
            expect(mockPush).toHaveBeenCalledWith("/article");
            expect(Swal.fire).toHaveBeenCalledWith(
                expect.objectContaining({
                    html: expect.stringContaining("Updated Article"),
                    icon: "success",
                })
            );
        });
    });

    test("Gère une erreur lors de la mise à jour", async () => {
        // Mock de l'erreur lors de l'appel PUT
        (global.fetch as jest.Mock).mockImplementation((url, options) => {
            if (options?.method === "PUT") {
                return Promise.resolve({
                    ok: false,
                    status: 500,
                    json: () =>
                        Promise.resolve({ message: "Erreur serveur lors de la mise à jour" }),
                });
            }
            if (url === "/api/article/123") {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            article_name: "Test Article",
                            article_description: "Description",
                            barcode: "123456",
                            quantity_min: 10,
                            unit: "pcs",
                            unit_price: 100,
                            categoryId: 1,
                        }),
                });
            }
            if (url === "/api/category") {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve([
                            { id: 1, category_name: "Category 1" },
                            { id: 2, category_name: "Category 2" },
                        ]),
                });
            }
            return Promise.reject(new Error("URL non gérée"));
        });
    
        render(<Page />);
    
        // Attendez que le chargement initial disparaisse
        await waitFor(() => {
            expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        });
    
        // Simulez la soumission du formulaire
        fireEvent.submit(screen.getByRole("button", { name: /Sauvegarder/i }));
    
        // Vérifiez que Swal.fire est appelé avec les bons arguments d'erreur
        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                "Erreur",
                "Une erreur est survenue lors de la mise à jour de l'article.",
                "error"
            );
        });
    });
});

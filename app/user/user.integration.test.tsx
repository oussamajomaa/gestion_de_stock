import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Page from "@/app/user/page";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

// Mock de `next/navigation`
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

// Mock de SweetAlert2
jest.mock("sweetalert2", () => ({
    fire: jest.fn(),
}));

// Mock global de fetch
global.fetch = jest.fn();

describe("Intégration de la gestion des utilisateurs", () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn((key) => {
                    if (key === "role") return "admin";
                    if (key === "email") return "admin@example.com";
                    return null;
                }),
                setItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true,
        });

        (global.fetch as jest.Mock).mockImplementation((url, options) => {
            if (url === "/api/user" && !options) {
                return Promise.resolve({
                    ok: true,
                    json: async () => [
                        { id: 1, email: "user1@example.com", role: "admin" },
                        { id: 2, email: "user2@example.com", role: "user" },
                    ],
                });
            }
            if (url.startsWith("/api/user/") && options?.method === "DELETE") {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ message: "Utilisateur supprimé avec succès" }),
                });
            }
            return Promise.reject(new Error("URL non gérée"));
        });

        jest.clearAllMocks();
    });

    test("Valide le flux complet de gestion des utilisateurs", async () => {
        // Rendu de la page
        await act(async () => {
            render(<Page />);
        });

        // Vérifiez que la liste des utilisateurs est affichée
        await waitFor(() => {
            expect(screen.getByText("user1@example.com")).toBeInTheDocument();
            expect(screen.getByText("user2@example.com")).toBeInTheDocument();
        });

        // Cliquez sur le bouton d'ajout et vérifiez la redirection
        const addButton = screen.getByLabelText("Add user");
        fireEvent.click(addButton);
        expect(mockPush).toHaveBeenCalledWith("/user/add");

        // Cliquez sur le bouton d'édition pour user1 et vérifiez la redirection
        const editButton = screen.getByLabelText("Edit user1@example.com");
        fireEvent.click(editButton);
        expect(mockPush).toHaveBeenCalledWith("/user/1");

        // Mockez la confirmation pour la suppression d'un utilisateur
        (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });

        // Cliquez sur le bouton de suppression pour user1
        const deleteButton = screen.getByLabelText("Delete user1@example.com");
        fireEvent.click(deleteButton);

        // Vérifiez que l'API DELETE a été appelée correctement
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/user/1", expect.objectContaining({ method: "DELETE" }));
        });

        // Vérifiez que le message de succès a été affiché
        expect(Swal.fire).toHaveBeenCalledWith("", "Utilisateur supprimé avec succès", "success");
    });
});

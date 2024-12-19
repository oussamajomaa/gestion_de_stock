import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/login/page";
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

describe("Test d'intégration : Page de connexion", () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        // Mock de useRouter pour simuler une redirection
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        // Mock de localStorage
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true,
        });

        jest.clearAllMocks();
    });

    test("Affiche correctement les champs initiaux", () => {
        render(<Login />);

        // Vérifiez que les champs et le bouton sont rendus
        expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Mot de passe")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    test("Connexion réussie et redirection", async () => {
        // Mock de fetch pour simuler une réponse réussie
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: "123",
                token: "mock-token",
                role: "admin",
                email: "test@example.com",
            }),
        });

        render(<Login />);

        // Simulez la saisie des champs
        fireEvent.change(screen.getByPlaceholderText("E-mail"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Mot de passe"), {
            target: { value: "password123" },
        });

        // Simulez la soumission du formulaire
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        // Vérifiez l'intégration complète
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "/api/login",
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({
                        email: "test@example.com",
                        password: "password123",
                    }),
                })
            );

            // Vérifiez que les données sont enregistrées dans localStorage
            expect(localStorage.setItem).toHaveBeenCalledWith("token", "mock-token");
            expect(localStorage.setItem).toHaveBeenCalledWith("id", "123");
            expect(localStorage.setItem).toHaveBeenCalledWith("role", "admin");
            expect(localStorage.setItem).toHaveBeenCalledWith("email", "test@example.com");

            // Vérifiez que l'utilisateur est redirigé
            expect(mockPush).toHaveBeenCalledWith("/");
        });
    });

    test("Connexion échouée avec affichage d'erreur", async () => {
        // Mock de fetch pour simuler une erreur
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({
                message: "Invalid credentials",
                icon: "error",
            }),
        });

        render(<Login />);

        // Simulez la saisie des champs
        fireEvent.change(screen.getByPlaceholderText("E-mail"), {
            target: { value: "wrong@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Mot de passe"), {
            target: { value: "wrongpassword" },
        });

        // Simulez la soumission du formulaire
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        // Vérifiez l'intégration complète
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "/api/login",
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({
                        email: "wrong@example.com",
                        password: "wrongpassword",
                    }),
                })
            );

            // Vérifiez que SweetAlert est appelé avec le message d'erreur
            expect(Swal.fire).toHaveBeenCalledWith(
                "",
                "Invalid credentials",
                "error"
            );
        });
    });

    test("Redirection si utilisateur déjà connecté", () => {
        // Simulez un utilisateur déjà connecté
        localStorage.getItem = jest.fn(() => "mock-token");

        render(<Login />);

        // Vérifiez que l'utilisateur est immédiatement redirigé
        expect(mockPush).toHaveBeenCalledWith("/");
    });
});

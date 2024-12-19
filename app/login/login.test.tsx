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

describe("Page de connexion", () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        // Mock du router pour rediriger après connexion
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        // Mock global de `localStorage`
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true,
        });

        jest.clearAllMocks();
    });

    test("Affiche les champs de saisie pour email et mot de passe", () => {
        render(<Login />);

        expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Mot de passe")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    test("Simule une connexion réussie", async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        id: "123",
                        token: "mock-token",
                        role: "admin",
                        email: "test@example.com",
                    }),
            })
        );

        render(<Login />);

        // Renseignez les champs
        fireEvent.change(screen.getByPlaceholderText("E-mail"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Mot de passe"), {
            target: { value: "password123" },
        });

        // Soumettez le formulaire
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        // Attendez la redirection
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
            expect(localStorage.setItem).toHaveBeenCalledWith("token", "mock-token");
            expect(mockPush).toHaveBeenCalledWith("/");
        });
    });

    test("Gère une erreur lors de la connexion", async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () =>
                    Promise.resolve({
                        message: "Invalid credentials",
                        icon: "error",
                    }),
            })
        );

        render(<Login />);

        // Renseignez les champs
        fireEvent.change(screen.getByPlaceholderText("E-mail"), {
            target: { value: "wrong@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Mot de passe"), {
            target: { value: "wrongpassword" },
        });

        // Soumettez le formulaire
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        // Vérifiez que SweetAlert est appelé avec un message d'erreur
        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(
                "",
                "Invalid credentials",
                "error"
            );
        });
    });
});

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

describe("Page de gestion des utilisateurs", () => {
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

        (global.fetch as jest.Mock).mockImplementation((url) => {
            if (url === "/api/user") {
                return Promise.resolve({
                    ok: true,
                    json: async () => [
                        { id: 1, email: "user1@example.com", role: "admin" },
                        { id: 2, email: "user2@example.com", role: "user" },
                    ],
                });
            }
            if (url.startsWith("/api/user/")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ message: "Utilisateur supprimé avec succès" }),
                });
            }
            return Promise.reject(new Error("URL non gérée"));
        });

        jest.clearAllMocks();
    });

    test("Affiche la liste des utilisateurs récupérés", async () => {
        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(screen.getByText("user1@example.com")).toBeInTheDocument();
            expect(screen.getByText("user2@example.com")).toBeInTheDocument();
        });
    });

    test("Redirige vers la page d'ajout d'utilisateur", async () => {
        await act(async () => {
            render(<Page />);
        });

        const addButton = screen.getByLabelText("Add user");
        fireEvent.click(addButton);

        expect(mockPush).toHaveBeenCalledWith("/user/add");
    });

    test("Redirige vers la page d'édition d'un utilisateur", async () => {
        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(screen.getByText("user1@example.com")).toBeInTheDocument();
        });

        const editButton = screen.getByLabelText("Edit user1@example.com");
        fireEvent.click(editButton);

        expect(mockPush).toHaveBeenCalledWith("/user/1");
    });

    test("Supprime un utilisateur après confirmation", async () => {
        await act(async () => {
            render(<Page />);
        });

        await waitFor(() => {
            expect(screen.getByText("user1@example.com")).toBeInTheDocument();
        });

        (Swal.fire as jest.Mock).mockResolvedValueOnce({ isConfirmed: true });

        const deleteButton = screen.getByLabelText("Delete user1@example.com");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/user/1", expect.objectContaining({ method: "DELETE" }));
        });
    });
});

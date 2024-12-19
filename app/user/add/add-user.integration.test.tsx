import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "./page";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// Mock `next/navigation`
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

// Mock SweetAlert2
jest.mock("sweetalert2", () => ({
    fire: jest.fn(),
}));

// Mock global fetch API
global.fetch = jest.fn();

describe("Integration Test - Add User", () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn((key) => {
                    if (key === "role") return "admin";
                    return null;
                }),
                setItem: jest.fn(),
                clear: jest.fn(),
            },
            writable: true,
        });
    });

    it("integrates the full process of adding a user", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            message: "Utilisateur ajouté avec succès",
            icon: "success",
          }),
        });
      
        render(<Register />);
      
        const emailInput = screen.getByPlaceholderText("E-mail");
        const passwordInput = screen.getByPlaceholderText("Mot de passe");
        const roleSelect = screen.getByRole("combobox"); // Utilisez `getByRole` pour trouver le champ select
        const submitButton = screen.getByRole("button", { name: "Valider" });
      
        fireEvent.change(emailInput, { target: { value: "testuser@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "securepassword" } });
      
        // Sélectionnez une valeur valide dans le menu déroulant
        fireEvent.change(roleSelect, { target: { value: "admin" } });
      
        fireEvent.click(submitButton);
      
        // Vérifiez l'appel API
        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(
            "/api/user",
            expect.objectContaining({
              method: "POST",
              body: JSON.stringify({
                email: "testuser@example.com",
                password: "securepassword",
                role: "admin",
              }),
            })
          );
        });
      
        // Vérifiez le succès de SweetAlert
        expect(Swal.fire).toHaveBeenCalledWith("", "Utilisateur ajouté avec succès", "success");
      
        // Vérifiez la redirection
        expect(mockPush).toHaveBeenCalledWith("/user");
      });      
});

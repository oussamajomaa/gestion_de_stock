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

describe("Register Component", () => {
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

  it("renders the form correctly", () => {
    render(<Register />);

    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByText("Choisir un rôle")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Valider" })).toBeInTheDocument();
  });

  it("handles input changes", () => {
    render(<Register />);

    const emailInput = screen.getByPlaceholderText("E-mail");
    const passwordInput = screen.getByPlaceholderText("Mot de passe");
    const roleSelect = screen.getByText("Choisir un rôle").closest("select");

    // Simule les changements d'inputs
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(roleSelect!, { target: { value: "user" } });

    // Vérifie les valeurs mises à jour
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
    expect(screen.getByDisplayValue("Utilisateur")).toBeInTheDocument();
  });

  it("submits the form and calls the API", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        message: "Utilisateur ajouté avec succès",
        icon: "success",
      }),
    });

    render(<Register />);

    const emailInput = screen.getByPlaceholderText("E-mail");
    const passwordInput = screen.getByPlaceholderText("Mot de passe");
    const roleSelect = screen.getByText("Choisir un rôle").closest("select");
    const submitButton = screen.getByRole("button", { name: "Valider" });

    // Remplit le formulaire
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(roleSelect!, { target: { value: "admin" } });

    // Soumet le formulaire
    fireEvent.click(submitButton);

    // Vérifie que l'API a été appelée avec les bonnes valeurs
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/user",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
            role: "admin",
          }),
        })
      );
    });

    // Vérifie que Swal est appelé
    expect(Swal.fire).toHaveBeenCalledWith("", "Utilisateur ajouté avec succès", "success");

    // Vérifie la redirection
    expect(mockPush).toHaveBeenCalledWith("/user");
  });

  it("shows an error message if the user is not an admin", () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValueOnce("user");

    render(<Register />);

    expect(Swal.fire).toHaveBeenCalledWith("", "Vous n'ếtes pas autorisé d....", "error");
  });
});

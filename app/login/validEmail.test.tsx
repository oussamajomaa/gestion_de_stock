import { validateEmail } from "@/lib/validation";

describe("Validation d'email", () => {
    test("Retourne true pour un email valide", () => {
        expect(validateEmail("test@example.com")).toBe(true);
    });

    test("Retourne false pour un email invalide", () => {
        expect(validateEmail("invalid-email")).toBe(false);
    });

    test("Retourne false pour une chaîne vide", () => {
        expect(validateEmail("")).toBe(false);
    });
});

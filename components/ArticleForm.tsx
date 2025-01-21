import { Category } from "@/types/category";
import { FiSave } from "react-icons/fi";

type ArticleFormProps = {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    formData: {
        article_name: string;
        article_description: string;
        barcode: string;
        quantity_min: number;
        unit: string;
        unit_price: number;
        categoryId: number | string | null; // Permet également null
    };
    categories: Category[]; // Liste des catégories
};

export default function ArticleForm({ onSubmit, onChange, formData, categories }: ArticleFormProps) {
    return (
        <form onSubmit={onSubmit}>
            <div className="mb-4">
                <div className="mb-4">
                    <label className="block" htmlFor="article_name">Nom de l&apos;article</label>
                    <input
                        id="article_name"
                        className="input input-bordered w-full"
                        name="article_name"
                        required
                        type="text"
                        value={formData.article_name}
                        onChange={onChange}
                    />
                </div>

            </div>
            <div className="mb-4">
                <label className="block" htmlFor="article_description">Description</label>
                <textarea
                    id="article_description"
                    className="textarea textarea-bordered w-full"
                    name="article_description"
                    value={formData.article_description}
                    onChange={onChange}
                ></textarea>
            </div>


            {/* Sélecteur de Catégorie */}
            <div className="mb-4">
                <label className="block" htmlFor="categoryId">
                    Catégorie
                </label>
                <select
                    className="select select-bordered w-full"
                    id="categoryId" // Ajoutez cet attribut
                    name="categoryId"
                    required
                    value={formData.categoryId || ""}
                    onChange={onChange}
                >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-2 ">
                <div className="mb-4">
                    <label className="block" htmlFor="quantity_min">
                        Quantité minimale
                    </label>
                    <input
                        className="input input-bordered w-full"
                        id="quantity_min"
                        name="quantity_min"
                        type="number"
                        value={formData.quantity_min}
                        onChange={onChange}
                    />
                </div>



                <div className="mb-4">
                    <label className="block" htmlFor="barcode">
                        Code-barres
                    </label>
                    <input
                        className="input input-bordered w-full"
                        id="barcode" // Ajoutez cet attribut
                        name="barcode"
                        required
                        type="text"
                        value={formData.barcode}
                        onChange={onChange}
                    />
                </div>

            </div>

            <div className="grid grid-cols-2 gap-2 ">
                <div className="mb-4">
                    <label className="block" htmlFor="unit">
                        Unité
                    </label>
                    <input
                        className="input input-bordered w-full"
                        id="unit" // Ajout de l'id correspondant
                        name="unit"
                        required
                        type="text"
                        value={formData.unit}
                        onChange={onChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block" htmlFor="unit_price">
                        Prix unitaire
                    </label>
                    <input
                        className="input input-bordered w-full"
                        id="unit_price" // Ajout de l'id correspondant
                        name="unit_price"
                        required
                        type="number"
                        value={formData.unit_price}
                        onChange={onChange}
                    />
                </div>

            </div>
            <button type="submit" className="flex gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 mb-3">
                <FiSave size={24} /> Sauvegarder
            </button>
        </form>
    );
}

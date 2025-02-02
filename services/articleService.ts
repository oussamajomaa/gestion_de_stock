const token = localStorage.getItem('token')
export const fetchArticles = async () => {
    const response  =await fetch('/api/article', {
        method:"GET",
        headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token
            'Content-Type': 'application/json',
        },
        
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des articles')
    }
    return response.json()
}

export const fetchArticleById = async (id: any) => {
    const response = await fetch(`/api/article/${id}`,{
        method:'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'article');
    }
    return response.json();
};

export const createArticle = async (articleData: any) => {
    const response = await fetch('/api/article', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
    });
    if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'article");
    }
    return response.json();
};

export const updateArticle = async (id: number, articleData: any) => {
    const response = await fetch(`/api/article/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'article');
    }
    return response.json();
};

export const deleteArticle = async (id: number) => {
    const response = await fetch(`/api/article/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`, // Ajouter le token
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'article');
    }
    return response.json();
};

import { z } from "zod";

// Schéma de validation pour le formulaire
export const articleSchema = z.object({
  title: z.string().min(5, { message: "Le titre doit contenir au moins 5 caractères" }),
  content: z.string().min(50, { message: "Le contenu doit contenir au moins 50 caractères" }),
  excerpt: z.string().min(10, { message: "L'extrait doit contenir au moins 10 caractères" }),
  category: z.string().min(1, { message: "Veuillez sélectionner une catégorie" }),
  featuredImage: z.string().url({ message: "L'URL de l'image doit être valide" }).optional().or(z.literal("")),
  status: z.enum(["draft", "publish"], { message: "Le statut doit être brouillon ou publié" })
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Trash, Plus, FileText, Search, LoaderCircle, BarChart2 } from "lucide-react";
import type { WordPressArticle } from "@/hooks/useWordpressArticles";
import { useTelegramArticles } from "@/hooks/useTelegramArticles";
import { TelegramArticle } from "@/services/telegramService";

const ArticlesManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<WordPressArticle | TelegramArticle | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch articles from Telegram
  const { data: telegramArticles, isLoading: isLoadingTelegram } = useTelegramArticles();

  // Keep existing WordPress fetch for compatibility
  const { data: wpArticles, isLoading: isLoadingWP } = useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: async () => {
      try {
        const response = await fetch(
          "https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=30"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      } catch (error) {
        console.error("Error fetching WordPress articles:", error);
        return [];
      }
    },
  });

  // Merge articles from both sources and sort by date
  const allArticles = [...(telegramArticles || []), ...(wpArticles || [])].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // In a real app, we would need to call Telegram API to delete the message
      // For now, just log it
      console.log("Deleting article with ID:", id);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["telegram-articles"] });
      queryClient.invalidateQueries({ queryKey: ["wordpress-articles"] });
      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error("Error deleting article:", error);
    },
  });

  // Handle article deletion
  const handleDeleteClick = (article: WordPressArticle | TelegramArticle) => {
    setSelectedArticle(article);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedArticle) {
      deleteMutation.mutate(selectedArticle.id);
      setShowDeleteDialog(false);
    }
  };

  // Filter articles based on search term
  const filteredArticles = allArticles.filter(article => {
    let title = "";
    
    if ('title' in article) {
      if (typeof article.title === 'object' && article.title.rendered) {
        // WordPress article
        title = new DOMParser().parseFromString(
          article.title.rendered, 
          'text/html'
        ).body.textContent || '';
      } else {
        // Telegram article
        title = article.title as string;
      }
    }
    
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const isLoading = isLoadingTelegram || isLoadingWP;

  const getArticleTitle = (article: any): string => {
    if (typeof article.title === 'object' && article.title.rendered) {
      // WordPress article
      return new DOMParser().parseFromString(
        article.title.rendered, 
        'text/html'
      ).body.textContent || article.title.rendered;
    } else {
      // Telegram article
      return article.title;
    }
  };

  const getArticleSource = (article: any): string => {
    if (typeof article.title === 'object' && article.title.rendered) {
      return "WordPress";
    } else {
      return "Telegram";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Gestion des articles</h2>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Rechercher un article..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Articles table */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <LoaderCircle className="animate-spin mr-2 text-primary" />
            <span>Chargement des articles...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead className="w-[120px]">Source</TableHead>
                  <TableHead className="w-[120px]">Statistiques</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles && filteredArticles.length > 0 ? (
                  filteredArticles.map((article: any) => {
                    const title = getArticleTitle(article);
                    const source = getArticleSource(article);
                    
                    // Générer un nombre aléatoire pour les vues (pour la démo seulement)
                    const randomViews = Math.floor(Math.random() * 1000) + 100;
                    
                    return (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.id}</TableCell>
                        <TableCell className="font-medium">{title}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            source === "Telegram" 
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300" 
                              : "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300"
                          }`}>
                            {source}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="flex items-center text-sm">
                              <BarChart2 size={14} className="mr-1 text-primary" />
                              {randomViews} vues
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              title="Voir l'article"
                            >
                              <FileText size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              title="Modifier l'article"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              title="Supprimer l'article"
                              onClick={() => handleDeleteClick(article)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      {searchTerm ? "Aucun article trouvé pour cette recherche." : "Aucun article disponible."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet article?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. L'article sera définitivement supprimé
              de notre serveur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ArticlesManagement;

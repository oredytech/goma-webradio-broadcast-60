
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  Edit, 
  Trash, 
  Plus, 
  FileText, 
  Save,
  Search,
  LoaderCircle 
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog";
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
import type { WordPressArticle } from "@/hooks/useWordpressArticles";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<WordPressArticle | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch articles
  const { data: articles, isLoading } = useQuery<WordPressArticle[]>({
    queryKey: ["wordpress-articles"],
    queryFn: async () => {
      const response = await fetch(
        "https://totalementactus.net/wp-json/wp/v2/posts?_embed&per_page=30"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // In a real app, this would call the WordPress API to delete the article
      console.log("Deleting article with ID:", id);
      return { success: true };
    },
    onSuccess: () => {
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

  // Update article mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; title: string; content: string }) => {
      // In a real app, this would call the WordPress API to update the article
      console.log("Updating article:", data);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wordpress-articles"] });
      toast({
        title: "Article mis à jour",
        description: "L'article a été mis à jour avec succès.",
      });
      setShowEditDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'article. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error("Error updating article:", error);
    },
  });

  // Handle article deletion
  const handleDeleteClick = (article: WordPressArticle) => {
    setSelectedArticle(article);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedArticle) {
      deleteMutation.mutate(selectedArticle.id);
      setShowDeleteDialog(false);
    }
  };

  // Handle article editing
  const handleEditClick = (article: WordPressArticle) => {
    setSelectedArticle(article);
    
    // Parse HTML content to plain text
    const titleText = new DOMParser().parseFromString(
      article.title.rendered, 
      'text/html'
    ).body.textContent || article.title.rendered;
    
    const contentText = new DOMParser().parseFromString(
      article.content.rendered, 
      'text/html'
    ).body.textContent || article.content.rendered;
    
    setEditForm({
      title: titleText,
      content: contentText,
    });
    
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (selectedArticle) {
      updateMutation.mutate({
        id: selectedArticle.id,
        title: editForm.title,
        content: editForm.content,
      });
    }
  };

  // Filter articles based on search term
  const filteredArticles = articles?.filter(article => {
    const title = new DOMParser().parseFromString(
      article.title.rendered, 
      'text/html'
    ).body.textContent || '';
    
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-black">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-white">Tableau de bord - Articles</h1>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Nouvel article
            </Button>
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
                      <TableHead className="w-[150px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles && filteredArticles.length > 0 ? (
                      filteredArticles.map((article) => {
                        const title = new DOMParser().parseFromString(
                          article.title.rendered, 
                          'text/html'
                        ).body.textContent || article.title.rendered;
                        
                        return (
                          <TableRow key={article.id}>
                            <TableCell className="font-medium">{article.id}</TableCell>
                            <TableCell className="font-medium">{title}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => navigate(`/article/${article.id}`)}
                                >
                                  <FileText size={16} />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEditClick(article)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
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
                        <TableCell colSpan={3} className="text-center py-6">
                          {searchTerm ? "Aucun article trouvé pour cette recherche." : "Aucun article disponible."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Article Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Modifier l'article</DialogTitle>
            <DialogDescription>
              Modifiez les détails de l'article puis cliquez sur Enregistrer pour sauvegarder vos changements.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Titre
              </label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="content" className="text-sm font-medium">
                Contenu
              </label>
              <Textarea
                id="content"
                rows={12}
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button 
              onClick={handleSaveEdit}
              disabled={updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending && <LoaderCircle className="animate-spin" size={16} />}
              <Save size={16} />
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      <Footer />
    </div>
  );
};

export default Dashboard;


const ArticleSidebar = () => {
  return (
    <aside className="lg:col-span-4 space-y-8">
      {/* Recent Comments Section */}
      <div className="bg-card/50 dark:bg-accent/50 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-foreground mb-4">Derniers commentaires</h3>
        <div className="space-y-4">
          <div className="border-b border-border dark:border-primary/20 pb-4">
            <p className="text-muted-foreground text-sm">Pas encore de commentaires</p>
          </div>
        </div>
      </div>

      {/* Advertisement Section */}
      <div className="bg-card/50 dark:bg-accent/50 rounded-lg p-6 backdrop-blur-sm sticky top-24">
        <h3 className="text-xl font-bold text-foreground mb-4">Publicité</h3>
        <div className="rounded-lg flex items-center justify-center">
          <a 
            href="https://affiliation.lws-hosting.com/statistics/click/248/872316963" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="https://affiliation.lws-hosting.com/banners/viewbanner/248/872316963" 
              alt="LWS Hosting" 
              className="w-full h-auto" 
              style={{ maxWidth: "100%" }}
            />
          </a>
        </div>
      </div>
    </aside>
  );
};

export default ArticleSidebar;

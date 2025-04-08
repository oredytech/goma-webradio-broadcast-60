
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

const DashboardLayout = ({
  children,
  title,
  description,
  action
}: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30 dark:bg-background">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {action && action}
        </div>

        <Separator className="my-6" />

        {children}
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;

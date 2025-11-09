import { useEffect } from 'react';

interface ExternalRedirectProps {
  to: string;
}

export default function ExternalRedirect({ to }: ExternalRedirectProps) {
  useEffect(() => {
    window.location.href = to;
  }, [to]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirection vers {to}...</p>
    </div>
  );
}

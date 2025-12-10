import { ProfileForm } from "@/components/ProfileForm";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <header className="text-center mb-12 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              AI Style Brain
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Create your personalized style profile for tailored fit and fashion recommendations
            </p>
          </header>

          <ProfileForm />
        </div>
      </div>
    </main>
  );
};

export default Index;

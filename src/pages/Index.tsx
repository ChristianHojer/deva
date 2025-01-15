import { MainLayout } from "@/components/MainLayout";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Here's an overview of your dashboard
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Content will go here in future iterations */}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
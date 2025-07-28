import { Button } from "@/components/ui/button";
import { Plus, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card shadow-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 
              className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent cursor-pointer" 
              onClick={() => navigate('/')}
            >
              MessageFlow
            </h1>
            <span className="text-sm text-muted-foreground">
              Automação GoHighLevel
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </Button>
            
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            
            <Button 
              className="bg-gradient-primary hover:bg-gradient-primary/90" 
              size="sm"
              onClick={() => navigate('/create-campaign')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
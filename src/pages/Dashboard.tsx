import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CampaignCard, Campaign } from "@/components/dashboard/CampaignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MessageSquare, 
  Users, 
  Clock, 
  TrendingUp,
  Search,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Campanha Black Friday 2024',
    status: 'active',
    progress: 45,
    totalContacts: 1250,
    sentMessages: 563,
    startDate: '15/11/2024',
    lastActivity: 'Há 2 minutos'
  },
  {
    id: '2',
    name: 'Follow-up Leads Qualificados',
    status: 'paused',
    progress: 78,
    totalContacts: 430,
    sentMessages: 335,
    startDate: '12/11/2024',
    lastActivity: 'Há 1 hora'
  },
  {
    id: '3',
    name: 'Reativação de Clientes',
    status: 'completed',
    progress: 100,
    totalContacts: 850,
    sentMessages: 850,
    startDate: '08/11/2024',
    endDate: '14/11/2024',
    lastActivity: 'Há 2 dias'
  },
  {
    id: '4',
    name: 'Lançamento Produto Novo',
    status: 'scheduled',
    progress: 0,
    totalContacts: 2100,
    sentMessages: 0,
    startDate: '20/11/2024',
    lastActivity: 'Agendada'
  }
];

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalContacts: campaigns.reduce((acc, c) => acc + c.totalContacts, 0),
    messagesSent: campaigns.reduce((acc, c) => acc + c.sentMessages, 0)
  };

  const handlePauseCampaign = (id: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === id 
          ? { ...campaign, status: 'paused' as const }
          : campaign
      )
    );
    toast({
      title: "Campanha pausada",
      description: "A campanha foi pausada com sucesso.",
    });
  };

  const handleResumeCampaign = (id: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === id 
          ? { ...campaign, status: 'active' as const }
          : campaign
      )
    );
    toast({
      title: "Campanha retomada",
      description: "A campanha foi retomada com sucesso.",
    });
  };

  const handleEditCampaign = (id: string) => {
    toast({
      title: "Editar campanha",
      description: "Redirecionando para edição...",
    });
  };

  const handleDuplicateCampaign = (id: string) => {
    const originalCampaign = campaigns.find(c => c.id === id);
    if (originalCampaign) {
      const newCampaign: Campaign = {
        ...originalCampaign,
        id: Date.now().toString(),
        name: `${originalCampaign.name} (Cópia)`,
        status: 'scheduled',
        progress: 0,
        sentMessages: 0,
        startDate: new Date().toLocaleDateString('pt-BR'),
        lastActivity: 'Recém criada'
      };
      setCampaigns(prev => [newCampaign, ...prev]);
      toast({
        title: "Campanha duplicada",
        description: "A campanha foi duplicada com sucesso.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Campanhas"
            value={stats.totalCampaigns}
            icon={MessageSquare}
            variant="primary"
          />
          <StatsCard
            title="Campanhas Ativas"
            value={stats.activeCampaigns}
            icon={TrendingUp}
            variant="success"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total de Contatos"
            value={stats.totalContacts.toLocaleString('pt-BR')}
            icon={Users}
            description="Across all campaigns"
          />
          <StatsCard
            title="Mensagens Enviadas"
            value={stats.messagesSent.toLocaleString('pt-BR')}
            icon={Clock}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Campaigns Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold">Suas Campanhas</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar campanhas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="paused">Pausadas</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                  <SelectItem value="scheduled">Agendadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Campaigns Grid */}
          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onPause={handlePauseCampaign}
                  onResume={handleResumeCampaign}
                  onEdit={handleEditCampaign}
                  onDuplicate={handleDuplicateCampaign}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Nenhuma campanha encontrada' 
                  : 'Nenhuma campanha criada ainda'
                }
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece criando sua primeira campanha de mensagens automatizadas.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
                  Criar Primeira Campanha
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
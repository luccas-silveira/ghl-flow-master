import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  Edit, 
  Copy, 
  MoreHorizontal,
  Calendar,
  Users,
  MessageSquare
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export type CampaignStatus = 'active' | 'paused' | 'completed' | 'scheduled' | 'error';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  progress: number;
  totalContacts: number;
  sentMessages: number;
  startDate: string;
  endDate?: string;
  lastActivity: string;
}

interface CampaignCardProps {
  campaign: Campaign;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export const CampaignCard = ({ 
  campaign, 
  onPause, 
  onResume, 
  onEdit, 
  onDuplicate 
}: CampaignCardProps) => {
  const getStatusBadgeVariant = (status: CampaignStatus) => {
    switch (status) {
      case 'active':
        return 'bg-status-active text-status-active-foreground';
      case 'paused':
        return 'bg-status-paused text-status-paused-foreground';
      case 'completed':
        return 'bg-status-completed text-status-completed-foreground';
      case 'scheduled':
        return 'bg-status-scheduled text-status-scheduled-foreground';
      case 'error':
        return 'bg-status-error text-status-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: CampaignStatus) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'paused':
        return 'Pausada';
      case 'completed':
        return 'Concluída';
      case 'scheduled':
        return 'Agendada';
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  const canPause = campaign.status === 'active';
  const canResume = campaign.status === 'paused';

  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{campaign.name}</CardTitle>
            <Badge className={getStatusBadgeVariant(campaign.status)}>
              {getStatusText(campaign.status)}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(campaign.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(campaign.id)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span>{campaign.progress}%</span>
          </div>
          <Progress value={campaign.progress} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="font-semibold">{campaign.totalContacts}</div>
            <div className="text-muted-foreground text-xs">Contatos</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="font-semibold">{campaign.sentMessages}</div>
            <div className="text-muted-foreground text-xs">Enviadas</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="font-semibold text-xs">{campaign.startDate}</div>
            <div className="text-muted-foreground text-xs">Início</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {canPause && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPause(campaign.id)}
              className="flex-1"
            >
              <Pause className="h-4 w-4 mr-1" />
              Pausar
            </Button>
          )}
          
          {canResume && (
            <Button 
              size="sm" 
              onClick={() => onResume(campaign.id)}
              className="flex-1 bg-status-active hover:bg-status-active/90"
            >
              <Play className="h-4 w-4 mr-1" />
              Retomar
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(campaign.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
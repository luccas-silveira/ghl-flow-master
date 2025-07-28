import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  Upload,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [campaignData, setCampaignData] = useState({
    name: '',
    audience: {
      type: 'list', // 'list' or 'csv'
      selectedList: '',
      csvFile: null as File | null,
      totalContacts: 0
    },
    sender: {
      number: '',
      name: ''
    },
    message: {
      content: '',
      variables: [] as string[]
    },
    schedule: {
      startDate: '',
      startTime: '',
      endTime: '20:00',
      interval: 30, // seconds
      dailyLimit: 1000
    }
  });

  const steps = [
    { number: 1, title: 'Público-Alvo', icon: Users, description: 'Escolha sua audiência' },
    { number: 2, title: 'Remetente', icon: MessageSquare, description: 'Configure o envio' },
    { number: 3, title: 'Mensagem', icon: MessageSquare, description: 'Escreva sua mensagem' },
    { number: 4, title: 'Cronograma', icon: Clock, description: 'Agende o envio' },
    { number: 5, title: 'Resumo', icon: CheckCircle2, description: 'Confirme e inicie' }
  ];

  const mockLists = [
    { id: '1', name: 'Leads Qualificados Q4 2024', contacts: 1250 },
    { id: '2', name: 'Clientes Inativos', contacts: 430 },
    { id: '3', name: 'Prospects Black Friday', contacts: 850 },
  ];

  const mockSenders = [
    { id: '1', name: 'João Silva - Vendas', number: '+55 11 99999-0001' },
    { id: '2', name: 'Maria Santos - Suporte', number: '+55 11 99999-0002' },
    { id: '3', name: 'Carlos Lima - Gerente', number: '+55 11 99999-0003' },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    toast({
      title: "Campanha criada com sucesso!",
      description: "Sua campanha foi criada e está pronta para ser iniciada.",
    });
    navigate('/');
  };

  const detectVariables = (text: string) => {
    const variables = text.match(/\{\{(\w+)\}\}/g);
    return variables ? variables.map(v => v.replace(/[{}]/g, '')) : [];
  };

  const handleMessageChange = (content: string) => {
    const variables = detectVariables(content);
    setCampaignData(prev => ({
      ...prev,
      message: { content, variables }
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="campaign-name" className="text-base font-medium">
                Nome da Campanha
              </Label>
              <Input
                id="campaign-name"
                placeholder="Ex: Black Friday 2024"
                value={campaignData.name}
                onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-2"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Selecione o Público-Alvo</Label>
              
              <div className="grid gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Listas do GoHighLevel</h4>
                  <div className="space-y-2">
                    {mockLists.map((list) => (
                      <div
                        key={list.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          campaignData.audience.selectedList === list.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => 
                          setCampaignData(prev => ({
                            ...prev,
                            audience: { 
                              ...prev.audience, 
                              type: 'list',
                              selectedList: list.id,
                              totalContacts: list.contacts
                            }
                          }))
                        }
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{list.name}</span>
                          <Badge variant="outline">{list.contacts} contatos</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Upload de CSV</h4>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arraste um arquivo CSV ou clique para selecionar
                    </p>
                    <Button variant="outline" size="sm">
                      Escolher Arquivo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Escolha o Remetente</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Selecione o número/vendedor que enviará as mensagens
              </p>
            </div>

            <div className="space-y-2">
              {mockSenders.map((sender) => (
                <div
                  key={sender.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    campaignData.sender.number === sender.number
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => 
                    setCampaignData(prev => ({
                      ...prev,
                      sender: { name: sender.name, number: sender.number }
                    }))
                  }
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{sender.name}</span>
                      <p className="text-sm text-muted-foreground">{sender.number}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Novo Remetente
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="message-content" className="text-base font-medium">
                Escreva sua Mensagem
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Use variáveis como {"{{nome}}"}, {"{{empresa}}"} para personalizar
              </p>
            </div>

            <Textarea
              id="message-content"
              placeholder="Olá {{nome}}! Temos uma oferta especial para {{empresa}}..."
              value={campaignData.message.content}
              onChange={(e) => handleMessageChange(e.target.value)}
              className="min-h-32"
            />

            {campaignData.message.variables.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Variáveis Detectadas:</h4>
                <div className="flex flex-wrap gap-2">
                  {campaignData.message.variables.map((variable, index) => (
                    <Badge key={index} variant="outline">
                      {"{{" + variable + "}}"}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Preview da Mensagem:</h4>
              <p className="text-sm">
                {campaignData.message.content
                  .replace(/\{\{nome\}\}/g, "João Silva")
                  .replace(/\{\{empresa\}\}/g, "Empresa LTDA")
                  || "Sua mensagem aparecerá aqui..."}
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="start-date" className="text-base font-medium">
                  Data de Início
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={campaignData.schedule.startDate}
                  onChange={(e) => 
                    setCampaignData(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, startDate: e.target.value }
                    }))
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="start-time" className="text-base font-medium">
                  Horário de Início
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  value={campaignData.schedule.startTime}
                  onChange={(e) => 
                    setCampaignData(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, startTime: e.target.value }
                    }))
                  }
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Janela de Funcionamento</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Defina o horário em que as mensagens podem ser enviadas
              </p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label htmlFor="end-time">Até às</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={campaignData.schedule.endTime}
                    onChange={(e) => 
                      setCampaignData(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, endTime: e.target.value }
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-medium">Intervalo entre Mensagens</Label>
                <Select 
                  value={campaignData.schedule.interval.toString()}
                  onValueChange={(value) => 
                    setCampaignData(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, interval: parseInt(value) }
                    }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 segundos</SelectItem>
                    <SelectItem value="60">1 minuto</SelectItem>
                    <SelectItem value="120">2 minutos</SelectItem>
                    <SelectItem value="300">5 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="daily-limit" className="text-base font-medium">
                  Limite Diário
                </Label>
                <Input
                  id="daily-limit"
                  type="number"
                  value={campaignData.schedule.dailyLimit}
                  onChange={(e) => 
                    setCampaignData(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, dailyLimit: parseInt(e.target.value) }
                    }))
                  }
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-status-active mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Campanha Pronta!</h3>
              <p className="text-muted-foreground">
                Revise os detalhes abaixo e clique em "Iniciar Campanha"
              </p>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Resumo da Campanha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nome:</span>
                      <p className="font-medium">{campaignData.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total de Contatos:</span>
                      <p className="font-medium">{campaignData.audience.totalContacts}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Remetente:</span>
                      <p className="font-medium">{campaignData.sender.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Início:</span>
                      <p className="font-medium">
                        {campaignData.schedule.startDate} às {campaignData.schedule.startTime}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Preview da Mensagem</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded text-sm">
                    {campaignData.message.content
                      .replace(/\{\{nome\}\}/g, "João Silva")
                      .replace(/\{\{empresa\}\}/g, "Empresa LTDA")}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Criar Nova Campanha</h1>
              <p className="text-muted-foreground">
                Configure sua campanha de mensagens automatizadas
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step) => {
                const isActive = step.number === currentStep;
                const isCompleted = step.number < currentStep;
                
                return (
                  <div key={step.number} className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : isCompleted 
                          ? 'bg-status-active text-status-active-foreground'
                          : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>

          {/* Content */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {currentStep === totalSteps ? (
              <Button 
                onClick={handleFinish}
                className="bg-gradient-success hover:bg-gradient-success/90"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Iniciar Campanha
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateCampaign;
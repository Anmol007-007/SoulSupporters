import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bot, 
  User, 
  Send, 
  MessageCircle, 
  Clock,
  AlertTriangle,
  Phone,
  Heart,
  Share 
} from "lucide-react";

interface Message {
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
  priority?: 'high' | 'medium' | 'low';
}

interface EmergencyResource {
  name: string;
  number?: string;
  text?: string;
}

const AIChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your AI mental health companion. I'm here to listen and provide support. How are you feeling today?",
      type: 'bot',
      timestamp: new Date(),
      priority: 'low'
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [emergencyResources, setEmergencyResources] = useState<EmergencyResource[]>([]);
  const [canShareWithCounsellor, setCanShareWithCounsellor] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage: Message = {
      content: inputValue,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-support', {
        body: {
          message: currentInput,
          history: messages.slice(-10).map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          language: 'en'
        }
      });

      if (error) throw error;

      const botResponse: Message = {
        content: data.response,
        type: 'bot',
        timestamp: new Date(),
        priority: data.priority
      };

      setMessages(prev => [...prev, botResponse]);
      
      if (data.emergencyResources) {
        setEmergencyResources(data.emergencyResources);
      }

      if (data.priority === 'high' || data.priority === 'medium') {
        setCanShareWithCounsellor(true);
      }

    } catch (error) {
      console.error('Error calling AI support:', error);
      const errorResponse: Message = {
        content: "I'm having trouble connecting right now. Please consider reaching out to a counselor if you need immediate support.",
        type: 'bot',
        timestamp: new Date(),
        priority: 'medium'
      };
      setMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Connection Error",
        description: "Unable to reach AI support. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const shareWithCounsellor = async () => {
    try {
      const { error } = await supabase.from('chat_sessions').insert({
        user_id: 'temp-user-id',
        session_data: { messages },
        risk_level: messages.some(m => m.priority === 'high') ? 'high' : 'medium',
        requires_intervention: true
      });

      if (error) throw error;

      toast({
        title: "Shared Successfully",
        description: "Your conversation has been shared with counselling team.",
      });
      setCanShareWithCounsellor(false);
    } catch (error) {
      console.error('Error sharing session:', error);
      toast({
        title: "Error",
        description: "Failed to share conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>AI Mental Health Support</span>
          </CardTitle>
          <CardDescription>
            Your confidential AI companion for mental health support and guidance
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col space-y-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`p-2 rounded-full ${
                      message.type === 'user' ? 'bg-primary' : 'bg-muted'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <Bot className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.priority && message.priority !== 'low' && (
                        <Badge 
                          variant={getPriorityColor(message.priority)} 
                          className="mt-2 text-xs"
                        >
                          {message.priority === 'high' ? 'Urgent' : 'Important'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-muted">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Share how you're feeling..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setInputValue("I'm feeling anxious about exams")}
              >
                Academic Stress
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setInputValue("I'm having trouble sleeping")}
              >
                Sleep Issues
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setInputValue("I feel overwhelmed")}
              >
                Feeling Overwhelmed
              </Button>
            </div>

            {canShareWithCounsellor && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={shareWithCounsellor}
                className="self-start"
              >
                <Share className="h-4 w-4 mr-2" />
                Share with Counsellor
              </Button>
            )}

            {emergencyResources.length > 0 && (
              <Alert className="border-destructive bg-destructive/5">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Crisis Resources Available:</strong>
                  <div className="mt-2 space-y-1">
                    {emergencyResources.map((resource, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{resource.name}: </span>
                        {resource.number && <strong>{resource.number}</strong>}
                        {resource.text && <strong>{resource.text}</strong>}
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChat;
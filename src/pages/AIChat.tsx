import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  Phone, 
  AlertTriangle,
  Heart,
  Lightbulb 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high';
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI mental health companion. I'm here to provide support, coping strategies, and guidance. How are you feeling today?",
      timestamp: new Date(),
      priority: 'low'
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    let response = "";
    let priority: 'low' | 'medium' | 'high' = 'low';

    // Crisis detection keywords
    if (input.includes('suicide') || input.includes('harm myself') || input.includes('end it all')) {
      response = "I'm very concerned about what you're sharing. Your life has value and there are people who want to help. Please reach out to a crisis helpline immediately or contact emergency services. Would you like me to provide emergency contact numbers?";
      priority = 'high';
    }
    // High stress indicators
    else if (input.includes('panic') || input.includes('anxiety attack') || input.includes('can\'t breathe')) {
      response = "It sounds like you might be experiencing intense anxiety. Let's try a quick breathing exercise: Breathe in for 4 counts, hold for 7, exhale for 8. Repeat this 3 times. I'm here with you. Would you like me to guide you through more coping techniques?";
      priority = 'medium';
    }
    // Depression indicators
    else if (input.includes('depressed') || input.includes('hopeless') || input.includes('empty')) {
      response = "I hear that you're going through a really difficult time. These feelings are valid, and you're not alone. Small steps can help - have you been able to maintain basic self-care like eating or sleeping? I can suggest some gentle activities that might help.";
      priority = 'medium';
    }
    // Stress management
    else if (input.includes('stressed') || input.includes('overwhelmed') || input.includes('pressure')) {
      response = "Stress can feel overwhelming, but there are ways to manage it. Try breaking tasks into smaller steps, practice deep breathing, or take short breaks. What specific situation is causing you the most stress right now?";
      priority = 'low';
    }
    // General support
    else {
      response = "Thank you for sharing that with me. It takes courage to reach out. I'm here to listen and support you. Can you tell me more about what's on your mind? Sometimes talking through our thoughts and feelings can help us process them better.";
      priority = 'low';
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      priority
    };
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'destructive';
      default: return 'secondary';
    }
  };

  const quickResponses = [
    "I'm feeling anxious",
    "I need coping strategies",
    "I'm having trouble sleeping",
    "I feel overwhelmed"
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <Card className="mb-4 shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <span>AI Mental Health Support</span>
            <Badge variant="secondary" className="ml-auto">
              24/7 Available
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-success" />
              <span>Confidential</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lightbulb className="h-4 w-4 text-warning" />
              <span>Evidence-based guidance</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col shadow-soft">
        <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex space-x-3",
                message.type === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.type === 'bot' && (
                <div className="p-2 bg-primary/10 rounded-full h-fit">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-lg",
                  message.type === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.content}</p>
                {message.priority && message.priority !== 'low' && (
                  <div className="mt-2 flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <Badge variant={getPriorityColor(message.priority)} className="text-xs">
                      {message.priority === 'high' ? 'Urgent' : 'Important'}
                    </Badge>
                  </div>
                )}
              </div>

              {message.type === 'user' && (
                <div className="p-2 bg-secondary/20 rounded-full h-fit">
                  <User className="h-4 w-4 text-secondary-accent" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex space-x-3">
              <div className="p-2 bg-primary/10 rounded-full h-fit">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Quick Responses */}
        <div className="p-4 border-t border-border">
          <div className="flex flex-wrap gap-2 mb-4">
            {quickResponses.map((response, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(response)}
                className="text-xs"
              >
                {response}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      <Card className="mt-4 bg-destructive/5 border-destructive/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-destructive" />
            <span className="text-destructive font-medium">Crisis Support:</span>
            <span className="text-muted-foreground">
              If you're in immediate danger, call emergency services or the crisis helpline: 988
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChat;
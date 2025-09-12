import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  Headphones, 
  Search, 
  Download,
  Clock,
  Globe,
  Star
} from "lucide-react";

const videoResources = [
  {
    id: 1,
    title: "Understanding Anxiety",
    description: "Learn about anxiety symptoms and coping strategies",
    duration: "12 min",
    language: "English",
    category: "Education",
    rating: 4.8,
    thumbnail: "🧠"
  },
  {
    id: 2,
    title: "Mindfulness Meditation",
    description: "Guided meditation for stress relief",
    duration: "15 min",
    language: "Hindi",
    category: "Meditation",
    rating: 4.9,
    thumbnail: "🧘‍♀️"
  },
  {
    id: 3,
    title: "Depression Awareness",
    description: "Recognizing signs and seeking help",
    duration: "18 min",
    language: "Tamil",
    category: "Education",
    rating: 4.7,
    thumbnail: "💙"
  }
];

const audioResources = [
  {
    id: 1,
    title: "Deep Breathing Exercise",
    description: "5-minute breathing technique for anxiety",
    duration: "5 min",
    language: "English",
    category: "Relaxation",
    rating: 4.9,
    thumbnail: "🌬️"
  },
  {
    id: 2,
    title: "Progressive Muscle Relaxation",
    description: "Body relaxation technique",
    duration: "20 min",
    language: "Bengali",
    category: "Relaxation",
    rating: 4.8,
    thumbnail: "💆‍♂️"
  },
  {
    id: 3,
    title: "Sleep Story",
    description: "Calming story to help with insomnia",
    duration: "25 min",
    language: "Telugu",
    category: "Sleep",
    rating: 4.7,
    thumbnail: "🌙"
  }
];

const guides = [
  {
    id: 1,
    title: "Student Stress Management",
    description: "Comprehensive guide for academic stress",
    pages: "24 pages",
    language: "English",
    category: "Academic",
    rating: 4.8,
    thumbnail: "📚"
  },
  {
    id: 2,
    title: "Cultural Mental Health",
    description: "Understanding mental health in Indian context",
    pages: "18 pages",
    language: "Hindi",
    category: "Cultural",
    rating: 4.9,
    thumbnail: "🏛️"
  },
  {
    id: 3,
    title: "Relationship Wellness",
    description: "Building healthy relationships",
    pages: "16 pages",
    language: "Marathi",
    category: "Relationships",
    rating: 4.6,
    thumbnail: "💕"
  }
];

const Resources = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedType, setSelectedType] = useState<'all' | 'video' | 'audio' | 'guide'>('all');
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showResourceDialog, setShowResourceDialog] = useState(false);

  const languages = ["all", "English", "Hindi", "Tamil", "Bengali", "Telugu", "Marathi"];

  const ResourceCard = ({ resource, type }: { resource: any, type: 'video' | 'audio' | 'guide' }) => {
    const getIcon = () => {
      switch (type) {
        case 'video': return <Play className="h-4 w-4" />;
        case 'audio': return <Headphones className="h-4 w-4" />;
        case 'guide': return <Download className="h-4 w-4" />;
      }
    };

    const getDurationLabel = () => {
      switch (type) {
        case 'video': case 'audio': return resource.duration;
        case 'guide': return resource.pages;
      }
    };

    return (
      <Card className="shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="text-3xl mb-2">{resource.thumbnail}</div>
            <Badge variant="outline" className="text-xs">
              {resource.category}
            </Badge>
          </div>
          <CardTitle className="text-lg line-clamp-1">{resource.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {resource.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{getDurationLabel()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="h-3 w-3" />
              <span>{resource.language}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-current text-yellow-500" />
              <span>{resource.rating}</span>
            </div>
          </div>
          <Button className="w-full" size="sm">
            {getIcon()}
            <span className="ml-2">
              {type === 'guide' ? 'Download' : 'Play'}
            </span>
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Psychoeducational Resources</span>
          </CardTitle>
          <CardDescription>
            Access videos, audio content, and guides in multiple regional languages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLanguage === lang ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {lang === "all" ? "All Languages" : lang}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Tabs */}
      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos" className="flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center space-x-2">
            <Headphones className="h-4 w-4" />
            <span>Audio</span>
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Guides</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} type="video" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audio">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audioResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} type="audio" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} type="guide" />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Featured Section */}
      <Card className="bg-gradient-secondary shadow-soft">
        <CardHeader>
          <CardTitle>Featured This Week</CardTitle>
          <CardDescription>
            Specially curated content for stress management during exam season
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
              <div className="text-2xl">📖</div>
              <div>
                <h4 className="font-medium">Exam Anxiety Guide</h4>
                <p className="text-sm text-muted-foreground">Evidence-based strategies</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
              <div className="text-2xl">🎵</div>
              <div>
                <h4 className="font-medium">Focus Music Playlist</h4>
                <p className="text-sm text-muted-foreground">Concentration enhancer</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  Heart,
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  TrendingUp,
  Activity,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Welcome to MindCare
          </h1>
          <p className="text-xl opacity-90 mb-6 max-w-2xl">
            Your comprehensive digital mental health companion. Get AI-powered support, 
            connect with professionals, and access wellness resources anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="secondary" size="lg" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Link to="/ai-chat">
                <MessageCircle className="h-5 w-5 mr-2" />
                Start AI Chat
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white/30 hover:bg-white/10">
              <Link to="/screening">
                <Activity className="h-5 w-5 mr-2" />
                Take Screening
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Mental Wellness Score"
          value="72%"
          description="Based on latest screening"
          icon={TrendingUp}
          trend="up"
          trendValue="+5%"
        />
        <StatsCard
          title="Sessions Completed"
          value="8"
          description="This month"
          icon={Calendar}
          trend="up"
          trendValue="+2"
        />
        <StatsCard
          title="AI Conversations"
          value="24"
          description="Total interactions"
          icon={MessageCircle}
          trend="neutral"
        />
        <StatsCard
          title="Resources Accessed"
          value="12"
          description="Learning materials"
          icon={BookOpen}
          trend="up"
          trendValue="+3"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span>AI Mental Health Support</span>
            </CardTitle>
            <CardDescription>
              Get immediate support through our AI-powered chat system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Our AI assistant is trained to provide evidence-based coping strategies 
              and can help assess when professional intervention is needed.
            </p>
            <Button asChild className="w-full">
              <Link to="/ai-chat">
                Start Conversation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Book Professional Session</span>
            </CardTitle>
            <CardDescription>
              Schedule appointments with certified counselors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect with on-campus counselors or licensed therapists through 
              our confidential booking system.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/booking">
                Book Appointment
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-secondary-accent" />
              <span className="text-lg">Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Access videos, guides, and relaxation content in multiple languages
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/resources">Explore Resources</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-secondary-accent" />
              <span className="text-lg">Peer Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Join moderated discussions with fellow students and volunteers
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/community">Join Community</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-secondary-accent" />
              <span className="text-lg">Privacy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your data is protected with end-to-end encryption and anonymization
            </p>
            <Button variant="outline" size="sm">
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
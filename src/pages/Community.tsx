import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Plus,
  Shield,
  Clock,
  Eye
} from "lucide-react";

const forumPosts = [
  {
    id: 1,
    title: "Dealing with exam anxiety - what works for you?",
    content: "Hey everyone, I've been struggling with anxiety during exams. My heart races and I can't focus. Has anyone found techniques that help?",
    author: "Anonymous Student",
    timestamp: "2 hours ago",
    replies: 12,
    likes: 8,
    category: "Academic Stress",
    isModerated: true
  },
  {
    id: 2,
    title: "Finding balance between studies and mental health",
    content: "I often feel guilty when I take breaks for self-care. How do you all manage to prioritize mental health without feeling like you're falling behind?",
    author: "Care Seeker",
    timestamp: "5 hours ago",
    replies: 7,
    likes: 15,
    category: "Self-Care",
    isModerated: true
  },
  {
    id: 3,
    title: "Resources for dealing with family pressure",
    content: "My family has high expectations and it's affecting my mental health. Are there any resources or strategies that have helped others in similar situations?",
    author: "Student Voice",
    timestamp: "1 day ago",
    replies: 23,
    likes: 31,
    category: "Family Issues",
    isModerated: true
  }
];

const supportGroups = [
  {
    id: 1,
    name: "First Year Support Circle",
    description: "For students adjusting to college life",
    members: 45,
    lastActivity: "2 hours ago",
    moderator: "Peer Volunteer Sarah"
  },
  {
    id: 2,
    name: "Academic Pressure Support",
    description: "Share strategies for managing academic stress",
    members: 78,
    lastActivity: "30 minutes ago",
    moderator: "Peer Volunteer Raj"
  },
  {
    id: 3,
    name: "Cultural Adjustment Group",
    description: "Support for students from diverse backgrounds",
    members: 32,
    lastActivity: "1 hour ago",
    moderator: "Peer Volunteer Priya"
  }
];

const Community = () => {
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [showNewPost, setShowNewPost] = useState(false);

  const categories = ["General", "Academic Stress", "Self-Care", "Family Issues", "Relationships", "Anxiety", "Depression"];

  const PostCard = ({ post }: { post: any }) => (
    <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {post.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{post.author}</p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{post.timestamp}</span>
                {post.isModerated && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-2 w-2 mr-1" />
                    Moderated
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {post.category}
          </Badge>
        </div>
        <CardTitle className="text-lg">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{post.content}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Heart className="h-4 w-4 mr-1" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageSquare className="h-4 w-4 mr-1" />
              {post.replies}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
          <Button variant="outline" size="sm">
            Reply
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Peer Support Community</span>
          </CardTitle>
          <CardDescription>
            Connect with fellow students in a safe, moderated environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-success" />
              <span>Moderated by trained volunteers</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4 text-primary" />
              <span>Anonymous participation</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Forum */}
        <div className="lg:col-span-2 space-y-6">
          {/* New Post Button */}
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <Button 
                onClick={() => setShowNewPost(!showNewPost)}
                className="w-full"
                variant={showNewPost ? "outline" : "default"}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showNewPost ? "Cancel" : "Start New Discussion"}
              </Button>
            </CardContent>
          </Card>

          {/* New Post Form */}
          {showNewPost && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Share Your Thoughts</CardTitle>
                <CardDescription>
                  Your post will be reviewed by moderators before being published
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
                <Textarea
                  placeholder="What's on your mind? Share your thoughts, ask for advice, or offer support to others..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                  <Button disabled={!newPostContent.trim()}>
                    Submit for Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Forum Posts */}
          <div className="space-y-4">
            {forumPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Support Groups */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Support Groups</CardTitle>
              <CardDescription>
                Join specialized discussion groups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {supportGroups.map((group) => (
                <div key={group.id} className="p-3 border border-border rounded-lg">
                  <h4 className="font-medium text-sm">{group.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{group.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{group.members} members</span>
                    <Button size="sm" variant="outline">Join</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Moderated by {group.moderator}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-primary rounded-full mt-2"></div>
                <p>Be respectful and supportive to all members</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-primary rounded-full mt-2"></div>
                <p>Share experiences, not specific medical advice</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-primary rounded-full mt-2"></div>
                <p>Maintain anonymity and respect privacy</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-primary rounded-full mt-2"></div>
                <p>Report concerning content to moderators</p>
              </div>
            </CardContent>
          </Card>

          {/* Crisis Resources */}
          <Card className="bg-destructive/5 border-destructive/20 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Need Immediate Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Crisis Helpline: <strong>988</strong></p>
              <p>Campus Counseling: <strong>(555) 123-4567</strong></p>
              <p>Emergency Services: <strong>911</strong></p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Community;
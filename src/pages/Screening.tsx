import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  BarChart3,
  ArrowLeft,
  ArrowRight 
} from "lucide-react";

// PHQ-9 Depression Screening Questions
const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself"
];

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" }
];

const Screening = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const goToNext = () => {
    if (currentQuestion < phq9Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeScreening();
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeScreening = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + parseInt(value), 0);
    setScore(totalScore);
    setIsCompleted(true);
  };

  const getScoreInterpretation = (score: number) => {
    if (score <= 4) {
      return {
        level: "Minimal Depression",
        color: "success",
        icon: CheckCircle,
        description: "Your responses suggest minimal symptoms of depression. Continue maintaining good mental health practices.",
        recommendations: [
          "Keep up healthy lifestyle habits",
          "Continue stress management techniques",
          "Stay connected with supportive relationships"
        ]
      };
    } else if (score <= 9) {
      return {
        level: "Mild Depression",
        color: "warning",
        icon: Info,
        description: "Your responses suggest mild symptoms of depression. Consider reaching out for support.",
        recommendations: [
          "Consider talking to a counselor",
          "Increase physical activity and social connections",
          "Practice stress reduction techniques"
        ]
      };
    } else if (score <= 14) {
      return {
        level: "Moderate Depression",
        color: "destructive",
        icon: AlertTriangle,
        description: "Your responses suggest moderate symptoms of depression. Professional support is recommended.",
        recommendations: [
          "Schedule an appointment with a mental health professional",
          "Consider therapy or counseling",
          "Reach out to trusted friends or family"
        ]
      };
    } else {
      return {
        level: "Severe Depression",
        color: "destructive",
        icon: AlertTriangle,
        description: "Your responses suggest severe symptoms of depression. Please seek professional help immediately.",
        recommendations: [
          "Contact a mental health professional urgently",
          "Consider immediate counseling or therapy",
          "Reach out to crisis support if needed"
        ]
      };
    }
  };

  const progress = ((currentQuestion + 1) / phq9Questions.length) * 100;
  const interpretation = isCompleted ? getScoreInterpretation(score) : null;

  if (isCompleted && interpretation) {
    const Icon = interpretation.icon;
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>PHQ-9 Screening Results</span>
            </CardTitle>
            <CardDescription>
              Based on your responses to the Patient Health Questionnaire-9
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Score: {score}/27</h3>
                <Badge variant={interpretation.color === 'success' ? 'secondary' : 'destructive'} className="mt-2">
                  {interpretation.level}
                </Badge>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {interpretation.description}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Recommendations:</h4>
              <ul className="space-y-2">
                {interpretation.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
                Retake Screening
              </Button>
              <Button className="flex-1">
                Book Consultation
              </Button>
            </div>

            {score >= 10 && (
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">Important Notice</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        If you're having thoughts of self-harm, please contact emergency services 
                        or a crisis helpline immediately: 988 (Suicide & Crisis Lifeline)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>PHQ-9 Depression Screening</span>
          </CardTitle>
          <CardDescription>
            Question {currentQuestion + 1} of {phq9Questions.length}
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">
            Over the last 2 weeks, how often have you been bothered by:
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium text-foreground">
              {phq9Questions[currentQuestion]}
            </p>
          </div>

          <RadioGroup 
            value={answers[currentQuestion] || ""} 
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {answerOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={goToPrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button 
              onClick={goToNext}
              disabled={!answers[currentQuestion]}
            >
              {currentQuestion === phq9Questions.length - 1 ? "Complete" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted/50 shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">About This Screening</p>
              <p className="text-xs text-muted-foreground mt-1">
                The PHQ-9 is a validated tool for screening depression. Your responses are confidential 
                and will help identify if you might benefit from additional support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Screening;
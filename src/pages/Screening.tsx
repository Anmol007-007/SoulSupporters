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

// Screening Instruments
const screeningInstruments = {
  phq9: {
    name: "PHQ-9 Depression Screening",
    description: "Patient Health Questionnaire for depression symptoms",
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
      "Trouble concentrating on things, such as reading the newspaper or watching television",
      "Moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
      "Thoughts that you would be better off dead, or of hurting yourself"
    ],
    maxScore: 27,
    interpretations: [
      { range: [0, 4], level: "Minimal Depression", color: "success" },
      { range: [5, 9], level: "Mild Depression", color: "warning" },
      { range: [10, 14], level: "Moderate Depression", color: "destructive" },
      { range: [15, 27], level: "Severe Depression", color: "destructive" }
    ]
  },
  gad7: {
    name: "GAD-7 Anxiety Screening",
    description: "Generalized Anxiety Disorder assessment",
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it's hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen"
    ],
    maxScore: 21,
    interpretations: [
      { range: [0, 4], level: "Minimal Anxiety", color: "success" },
      { range: [5, 9], level: "Mild Anxiety", color: "warning" },
      { range: [10, 14], level: "Moderate Anxiety", color: "destructive" },
      { range: [15, 21], level: "Severe Anxiety", color: "destructive" }
    ]
  },
  stress: {
    name: "Perceived Stress Scale",
    description: "Assessment of stress levels in daily life",
    questions: [
      "How often have you been upset because of something that happened unexpectedly?",
      "How often have you felt that you were unable to control important things in your life?",
      "How often have you felt nervous and stressed?",
      "How often have you felt confident about your ability to handle your personal problems?",
      "How often have you felt that things were going your way?",
      "How often have you found that you could not cope with all the things you had to do?"
    ],
    maxScore: 18,
    interpretations: [
      { range: [0, 6], level: "Low Stress", color: "success" },
      { range: [7, 12], level: "Moderate Stress", color: "warning" },
      { range: [13, 18], level: "High Stress", color: "destructive" }
    ]
  },
  wellbeing: {
    name: "General Wellbeing Check",
    description: "Overall mental health and lifestyle assessment",
    questions: [
      "How would you rate your overall sleep quality?",
      "How often do you engage in physical exercise or activity?",
      "How satisfied are you with your social relationships?",
      "How well are you managing academic/work responsibilities?",
      "How often do you practice stress-reduction techniques (meditation, deep breathing, etc.)?"
    ],
    maxScore: 15,
    interpretations: [
      { range: [0, 5], level: "Areas Need Attention", color: "destructive" },
      { range: [6, 10], level: "Moderate Wellbeing", color: "warning" },
      { range: [11, 15], level: "Good Wellbeing", color: "success" }
    ]
  }
};

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" }
];

const Screening = () => {
  const [selectedInstrument, setSelectedInstrument] = useState<keyof typeof screeningInstruments>('phq9');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [completedScreenings, setCompletedScreenings] = useState<any[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const currentInstrument = screeningInstruments[selectedInstrument];

  const goToNext = () => {
    if (currentQuestion < currentInstrument.questions.length - 1) {
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
    
    const newScreening = {
      instrument: selectedInstrument,
      name: currentInstrument.name,
      score: totalScore,
      maxScore: currentInstrument.maxScore,
      interpretation: getScoreInterpretation(totalScore),
      responses: answers,
      completedAt: new Date().toISOString()
    };
    
    setCompletedScreenings(prev => [...prev, newScreening]);
    setIsCompleted(true);
  };

  const startNewScreening = (instrumentKey: keyof typeof screeningInstruments) => {
    setSelectedInstrument(instrumentKey);
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setScore(0);
  };

  const generateSummary = () => {
    if (completedScreenings.length === 0) return "No assessments completed yet.";
    
    const latest = completedScreenings[completedScreenings.length - 1];
    const summaryParts = completedScreenings.map(screening => 
      `${screening.name}: ${screening.interpretation.level} (${screening.score}/${screening.maxScore})`
    );
    
    return `Mental Health Summary: ${summaryParts.join(', ')}. Latest assessment shows ${latest.interpretation.level}.`;
  };

  const getScoreInterpretation = (score: number) => {
    const interpretation = currentInstrument.interpretations.find(
      interp => score >= interp.range[0] && score <= interp.range[1]
    );
    
    if (!interpretation) return currentInstrument.interpretations[0];
    
    const getRecommendations = () => {
      if (interpretation.color === 'success') {
        return [
          "Continue maintaining good mental health practices",
          "Keep up healthy lifestyle habits",
          "Stay connected with supportive relationships"
        ];
      } else if (interpretation.color === 'warning') {
        return [
          "Consider talking to a counselor",
          "Increase physical activity and social connections",
          "Practice stress reduction techniques"
        ];
      } else {
        return [
          "Schedule an appointment with a mental health professional",
          "Consider therapy or counseling",
          "Reach out to trusted friends or family"
        ];
      }
    };
    
    return {
      ...interpretation,
      icon: interpretation.color === 'success' ? CheckCircle : 
            interpretation.color === 'warning' ? Info : AlertTriangle,
      description: `Your responses suggest ${interpretation.level.toLowerCase()} based on the ${currentInstrument.name}.`,
      recommendations: getRecommendations()
    };
  };

  const progress = ((currentQuestion + 1) / currentInstrument.questions.length) * 100;
  const interpretation = isCompleted ? getScoreInterpretation(score) : null;

  if (isCompleted && interpretation) {
    const Icon = interpretation.icon;
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>{currentInstrument.name} Results</span>
            </CardTitle>
            <CardDescription>
              {currentInstrument.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Score: {score}/{currentInstrument.maxScore}</h3>
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
              <Button onClick={() => setIsCompleted(false)} variant="outline" className="flex-1">
                Take Another Assessment
              </Button>
              <Button className="flex-1">
                Book Consultation
              </Button>
              {completedScreenings.length > 1 && (
                <Button onClick={() => setShowSummary(true)} variant="secondary" className="flex-1">
                  View Summary
                </Button>
              )}
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

  if (showSummary) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Mental Health Assessment Summary</span>
            </CardTitle>
            <CardDescription>
              Overview of all completed screenings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedScreenings.map((screening, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{screening.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Score: {screening.score}/{screening.maxScore}
                      </p>
                    </div>
                    <Badge variant={screening.interpretation.color === 'success' ? 'secondary' : 'destructive'}>
                      {screening.interpretation.level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Summary for AI Support:</h4>
              <p className="text-sm">{generateSummary()}</p>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={() => setShowSummary(false)} variant="outline">
                Back
              </Button>
              <Button onClick={() => setIsCompleted(false)}>
                Take New Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isCompleted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Assessment Selection */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Mental Health Screening Tools</span>
            </CardTitle>
            <CardDescription>
              Choose an assessment tool to evaluate your current mental health status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(screeningInstruments).map(([key, instrument]) => (
                <Card 
                  key={key} 
                  className={`cursor-pointer transition-colors ${
                    selectedInstrument === key ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedInstrument(key as keyof typeof screeningInstruments)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{instrument.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {instrument.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {instrument.questions.length} questions
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Header */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>{currentInstrument.name}</span>
            </CardTitle>
            <CardDescription>
              Question {currentQuestion + 1} of {currentInstrument.questions.length}
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
              {currentInstrument.questions[currentQuestion]}
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
              {currentQuestion === currentInstrument.questions.length - 1 ? "Complete" : "Next"}
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
              <p className="text-sm font-medium">About This Assessment</p>
              <p className="text-xs text-muted-foreground mt-1">
                {currentInstrument.description}. Your responses are confidential 
                and will help identify if you might benefit from additional support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    );
  }

  return null; // This should never be reached due to the conditions above
};

export default Screening;
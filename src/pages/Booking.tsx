import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Shield, 
  CheckCircle,
  Phone,
  Video,
  MapPin
} from "lucide-react";

const counselors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    experience: "8 years",
    rating: 4.9,
    availability: "Mon-Fri",
    image: "👩‍⚕️"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Student Counseling",
    experience: "12 years",
    rating: 4.8,
    availability: "Mon-Wed, Fri",
    image: "👨‍⚕️"
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialty: "Cultural & Academic Stress",
    experience: "6 years",
    rating: 4.9,
    availability: "Tue-Sat",
    image: "👩‍⚕️"
  }
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"
];

const sessionTypes = [
  { id: "video", label: "Video Call", icon: Video, description: "Online session via secure video" },
  { id: "phone", label: "Phone Call", icon: Phone, description: "Audio-only consultation" },
  { id: "in-person", label: "In-Person", icon: MapPin, description: "Visit campus counseling center" }
];

const Booking = () => {
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [sessionType, setSessionType] = useState<string>("video");
  const [concerns, setConcerns] = useState<string>("");
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = () => {
    if (selectedCounselor && selectedDate && selectedTime) {
      setIsBooked(true);
    }
  };

  if (isBooked) {
    const counselor = counselors.find(c => c.id === selectedCounselor);
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-soft text-center">
          <CardHeader className="pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-2xl">Appointment Confirmed!</CardTitle>
            <CardDescription>
              Your counseling session has been successfully scheduled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Counselor:</span>
                <span className="font-medium">{counselor?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Session Type:</span>
                <span className="font-medium capitalize">{sessionType.replace('-', ' ')}</span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>You will receive a confirmation email with session details and access information.</p>
            </div>

            <Button onClick={() => window.location.reload()} className="w-full">
              Book Another Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <span>Book Counseling Session</span>
          </CardTitle>
          <CardDescription>
            Schedule a confidential appointment with certified mental health professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-success" />
              <span>100% Confidential</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>50-minute sessions</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Counselor Selection */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Select Counselor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {counselors.map((counselor) => (
              <div
                key={counselor.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedCounselor === counselor.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-muted-foreground'
                }`}
                onClick={() => setSelectedCounselor(counselor.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{counselor.image}</div>
                  <div className="flex-1">
                    <h3 className="font-medium">{counselor.name}</h3>
                    <p className="text-sm text-muted-foreground">{counselor.specialty}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {counselor.experience}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        ⭐ {counselor.rating}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available: {counselor.availability}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Date & Time Selection */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Select Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => date < new Date() || date.getDay() === 0}
            />
            
            {selectedDate && (
              <div>
                <Label className="text-sm font-medium">Available Times</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Session Type & Details */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Session Type</Label>
            <RadioGroup value={sessionType} onValueChange={setSessionType} className="mt-2">
              {sessionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={type.id} id={type.id} />
                    <Label htmlFor={type.id} className="flex items-center space-x-2 cursor-pointer">
                      <Icon className="h-4 w-4" />
                      <div>
                        <span className="font-medium">{type.label}</span>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="concerns" className="text-sm font-medium">
              What would you like to discuss? (Optional)
            </Label>
            <Textarea
              id="concerns"
              placeholder="Briefly describe your concerns or goals for the session..."
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              className="mt-2"
            />
          </div>

          <Button 
            onClick={handleBooking}
            disabled={!selectedCounselor || !selectedDate || !selectedTime}
            className="w-full"
            size="lg"
          >
            Confirm Appointment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Booking;
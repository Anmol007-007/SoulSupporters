import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'self harm', 'self-harm',
  'cutting', 'hurt myself', 'want to die', 'better off dead', 'hopeless',
  'panic attack', 'can\'t breathe', 'emergency', 'crisis'
];

const detectCrisisLevel = (message: string): 'high' | 'medium' | 'low' => {
  const lowerMessage = message.toLowerCase();
  
  if (CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'high';
  }
  
  if (lowerMessage.includes('anxious') || lowerMessage.includes('depressed') || 
      lowerMessage.includes('stressed') || lowerMessage.includes('worried')) {
    return 'medium';
  }
  
  return 'low';
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history, screeningSummary, language = 'en' } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const priority = detectCrisisLevel(message);
    
    // Build context-aware system prompt
    let systemPrompt = `You are an empathetic AI mental health support assistant for students in India. 

CRITICAL GUIDELINES:
- You are NOT a replacement for professional medical care
- Always recommend seeking professional help for serious concerns
- Use culturally sensitive language appropriate for Indian students
- Be warm, non-judgmental, and supportive
- If user mentions suicide, self-harm, or crisis, immediately provide crisis resources
- Respond in ${language === 'hi' ? 'Hindi' : 'English'} unless specifically asked otherwise

CRISIS RESPONSE (if detecting suicidal ideation/self-harm):
"I'm very concerned about what you're sharing. Your life has value and there is help available. Please reach out immediately:
- National Suicide Prevention: 988
- Crisis Text Line: Text HOME to 741741
- Or go to your nearest emergency room
Would you like me to help you find local mental health resources?"

YOUR ROLE:
- Provide emotional support and coping strategies
- Share evidence-based wellness techniques (breathing, mindfulness, etc.)
- Normalize seeking help and encourage professional support
- Be aware of academic stress, family expectations, and social pressures common among Indian students`;

    if (screeningSummary) {
      systemPrompt += `\n\nUSER'S RECENT SCREENING RESULTS: ${screeningSummary}\nTailor your response considering their current mental health status.`;
    }

    // Prepare messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-6), // Last 6 messages for context
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI with priority:', priority);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages,
        max_completion_tokens: 500,
        // Note: temperature not supported for GPT-5
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({
      response: aiResponse,
      priority,
      timestamp: new Date().toISOString(),
      ...(priority === 'high' && {
        emergencyResources: [
          { name: 'National Suicide Prevention', number: '988' },
          { name: 'Crisis Text Line', text: 'HOME to 741741' },
          { name: 'Emergency Services', number: '112' }
        ]
      })
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-support function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm experiencing technical difficulties right now. Please consider reaching out to a counselor or crisis helpline if you need immediate support."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
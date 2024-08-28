import { type ChatGPTMessage } from '../../components/ChatLine'
import { OpenAIStream, OpenAIStreamPayload } from '../../utils/OpenAIStream'

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

export const config = {
  runtime: 'edge',
}

const handler = async (req: Request): Promise<Response> => {
  const body = await req.json()

  const messages: ChatGPTMessage[] = [
    {
      role: 'system',
      content: `You are a Cal Poly Slo chatbot designed to assist users in seeing if they are a good fit at cal poly slo. 
      
      After the first question as the user if they see a future in working with their favorite subject. 
      If they say yes: ask them a follow up question about their GPA. Make sure their answer is between 3.0-4.0. If that too is too little, reccomend them to apply to a different school and end the conversation. 

      If they say no: ask them if they have any other interests. Then proceed to ask them about their GPA. 

      After all these questions ask them how much time they plan on investing in school work if they were to join at cal poly. 
      If they say a lot then continue by providing them with the school you think is the best fit from 
      College of Agriculture, Food and Environmental Science 
      College of Architecture and Environmental Design 
      Orfalea College of Business 
      College of Engineering 
      College of Liberal Arts 
      Bailey College of Science and Mathematics 

      . If they say little then tell them a different school may be a better fit for them. 
      `,
    },
  ]
  messages.push(...body?.messages)

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    user: body?.user,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
export default handler

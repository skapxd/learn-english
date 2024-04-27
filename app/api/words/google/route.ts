// // app/api/chat/route.ts

// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')


// // Build a prompt from the messages
// function buildPrompt(
//   messages: { content: string; role: 'system' | 'user' | 'assistant' }[]
// ) {
//   return {
//     contents: messages
//       .filter(message => message.role === 'user' || message.role === 'assistant')
//       .map(message => ({
//         role: message.role === 'user' ? 'user' : 'model',
//         parts: [{ text: message.content }]
//       }))
//   }
// }

// export async function POST(req: Request) {
//   // Extract the `messages` from the body of the request
//   const { messages } = await req.json();

//   // Request the Google API for the response based on the prompt
//   const response = await genAI
//       .getGenerativeModel({ model: 'gemini-1.5-pro-latest' })


//   // Convert the response into a friendly text-stream
//   const stream = GoogleGenerativeAIStream(response);

//   // Respond with the stream
//   return new StreamingTextResponse(stream);
// }


import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req: Request) {
    try {
        const { words } = await req.json();
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const prompt = `te voy a dar una frase en ingles y tu trabajo es responder con la frase pero el como la pronunciaria un hispano hablante, ejemplo si te doy "the sheet is there" tu respondes "de shit is dere" o similar.
        tu siempre vas a responder un JSON valido siguiendo este type de typescript
        ====
        Type response = {
            data: string
        }
        ====       
        simpre json, las palabras son: ${words}`

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
        return NextResponse.json({ data: text })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error);
    }

}
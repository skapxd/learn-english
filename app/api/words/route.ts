import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY!})
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';


type GPTResponse = {
    data: string;
};

export async function POST(req: Request) {
    // Wrap with a try/catch to handle API errors
    const { words } = await req.json();
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `te voy a dar una frase en ingles y tu trabajo es responder con la frase pero el como la pronunciaria un hispano hablante, ejemplo si te doy "the sheet is there" tu respondes "de shit is dere" o similar.

                    tu siempre vas a responder un JSON valido siguiendo este type de typescript
                    ====
                    Type response = {
                        data: string
                    }
                    ====
                    
                    simpre json, las palabras son: ${words}`,
                    name: 'system',
                },
            ],
            temperature: 1,
            max_tokens: 1024,
            response_format: { type: "json_object" },
        });

        const GPTResponse = JSON.parse(response.choices[0].message.content!) as GPTResponse;

        console.log(GPTResponse)
        return NextResponse.json({ ...GPTResponse });
        
    } catch (error) {
        // Check if the error is an APIError
        if (error instanceof OpenAI.APIError) {
            const { name, status, headers, message } = error;
            return NextResponse.json({ name, status, headers, message }, { status });
        } else {
            throw error;
        }
    }
}// app/api/chat/route.ts


// http://localhost:3000/api/words
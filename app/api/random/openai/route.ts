import { temas } from "@/utils/const";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';


type GPTResponse = {
    data: string;
};


export async function POST(req: Request) {
    // Wrap with a try/catch to handle API errors
    const temaSeleccionado = temas[Math.floor(Math.random() * temas.length)];
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `Genera una oracion en ingles completa sobre este tema ${temaSeleccionado}, Tu trabajo es responder con la oración y tambien con la orarcion pero de el modo como se debe pronunciar en ingles pero escrito para que un hispano hablante sepa como pronunciar las palabras, algo similar a lo que hace el Pinyin para el Hanzi, ejemplo si te doy "the sheet is there" tu respondes "de shit is dere" muy similar a como funciona el Pinyi, la idea es hacer esto pero con el ingles para hispano hablantes.

                    tu siempre vas a responder un JSON valido siguiendo este type de typescript
                    ====
                    Type response = {
                        tema: string;
                        oracionEnIngles: string;
                        oracionDeAyuda: string;
                    }
                    ====
                    
                    siempre responde en JSON.`,
                    name: 'system',
                },
            ],
            temperature: 1,
            max_tokens: 1024,
            response_format: { type: "json_object" },
        });

        const GPTResponse = JSON.parse(response.choices[0].message.content) as GPTResponse;

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
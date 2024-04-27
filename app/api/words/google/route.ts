
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);


export async function POST(req: Request) {
    try {
        const { words } = await req.json();
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const prompt = `te voy a dar una frase en ingles y tu trabajo es responder con la frase pero el como la pronunciaria un hispano hablante de modo que ayude a saber como pronunciar las palabras, algo similar a lo que hace el pinjin para el hanzi, ejemplo si te doy "the sheet is there" tu respondes "de shit is dere" o similar.
        Las palabras son:
        "${words}"`

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return NextResponse.json({ data: text })
    } catch (error) {
        console.log(error)
        return NextResponse.json(error);
    }
}
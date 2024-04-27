import { temas } from "@/utils/const";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const temaSeleccionado = temas[Math.floor(Math.random() * temas.length)];
    console.log(temaSeleccionado);

    const promptDeTema = `Genera una oración en ingles completa sobre este tema ${temaSeleccionado}`;
    const tema = await generateContent(promptDeTema);

    const prompt = `Tu trabajo es responder con la oración pero de el modo como se debe pronunciar en ingles pero escrito para que un hispano hablante sepa como pronunciar las palabras, algo similar a lo que hace el Pinyin para el Hanzi, ejemplo si te doy "the sheet is there" tu respondes "de shit is dere" muy similar a como funciona el Pinyi, la idea es hacer esto pero con el ingles para hispano hablantes.
    Las palabras son:
    "${tema}"`;
    const oracionDeAyuda = await generateContent(prompt);

    console.log(oracionDeAyuda);
    return NextResponse.json({ 
      tema: temaSeleccionado,
      oracionEnIngles: tema,
      oracionDeAyuda,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}

async function generateContent(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

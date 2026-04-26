import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
  ASTRA_DB_COLLECTION
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY!,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(ASTRA_DB_API_ENDPOINT!, {
  keyspace: ASTRA_DB_NAMESPACE!,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content;

    // ✅ 1. CREATE EMBEDDING
    const embedding = await openai.embeddings.create({
      input: latestMessage,
      model: "text-embedding-3-small",
    });

    let docContext = "";

    // ✅ 2. VECTOR SEARCH
    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION!);

      const cursor = collection.find(null, {
        sort: {
          $vector: embedding.data[0].embedding,
        },
        limit: 10,
      });

      const documents = await cursor.toArray();
      const docsMap = documents?.map((doc) => doc.text);

      docContext = docsMap.join("\n\n"); // 🔥 cleaner than JSON
    } catch (error) {
      console.log("Error querying DB:", error);
      docContext = "";
    }

    // ✅ 3. SYSTEM PROMPT
    const systemPrompt = `
You are an AI assistant specialized in answering questions about Coppin State University.

Use the provided CONTEXT to give accurate, helpful, and concise answers.

Rules:
- Prioritize information from the CONTEXT.
- If the CONTEXT does not contain the answer, use your general knowledge.
- If you still don’t know the answer, say "I don’t know".
- Do NOT mention the CONTEXT or sources.
- Keep answers clear and student-friendly.
- Format responses using Markdown.
- Do NOT return images.

--------------------------
START CONTEXT
${docContext}
END CONTEXT
--------------------------
`;

    // ✅ 4. CALL OPENAI (STREAMING)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 🔥 best for your use case
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
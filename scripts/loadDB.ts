import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";
import { PuppeteerWebBaseLoader } from "@langchain/Community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "dotenv/config";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

// ----------------------
// OpenAI client (tutorial style)
// ----------------------
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY!,
});

// ----------------------
// Astra DB setup
// ----------------------
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN!);
const db = client.db(ASTRA_DB_API_ENDPOINT!, {
  keyspace: ASTRA_DB_NAMESPACE!,
});

const COLLECTION_NAME = "my_rag_chatbot";

// ----------------------
// Text splitter
// ----------------------
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

// Puppeteer scraper
// ----------------------
const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url);
  const docs = await loader.load();

  return docs.map((d) => d.pageContent).join("\n");
};

// ----------------------
// Create collection
// ----------------------
const createCollection = async () => {
  try {
    await db.dropCollection(COLLECTION_NAME);
    console.log("Old collection deleted");
  } catch {
    console.log("No existing collection");
  }

  await db.createCollection(COLLECTION_NAME, {
    vector: {
      dimension: 1536,
      metric: "dot_product",
    },
  });

  console.log("Collection created:", COLLECTION_NAME);
};

// ----------------------
// Embedding function (OPENAI SDK like tutorial)
// ----------------------
const embedText = async (text: string) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
};

// ----------------------
// Data sources
// ----------------------
const chatdata = [
  "https://www.coppin.edu/",
  "https://en.wikipedia.org/wiki/Coppin_State_University",
];

// ----------------------
// Load data pipeline
// ----------------------
const loadData = async () => {
  const collection = await db.collection(COLLECTION_NAME);

  for (const url of chatdata) {
    console.log("Scraping:", url);

    const content = await scrapePage(url);
    console.log("Content length:", content.length);

    const chunks = await splitter.splitText(content);

    for (const chunk of chunks) {
      const vector = await embedText(chunk);

      console.log("Vector length:", vector.length);

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      });

      console.log("Inserted ID:", res.insertedId);
    }
  }
};

// ----------------------
// Run
// ----------------------
const main = async () => {
  await createCollection();
  await loadData();
};

main().catch(console.error);
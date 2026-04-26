import "./global.css";
import type { Metadata } from 'next';


export const metadata: Metadata = {
    title: "RAG Chatbot",
    description: "A chatbot that uses Retrieval-Augmented Generation (RAG) to provide accurate and relevant responses based on a knowledge base.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
};

export default RootLayout;
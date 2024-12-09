import AiChat from "@/components/ai-chat";
import DocumentUploader from "@/components/document-uploader";

export default function Home() {
  return (
    <main className="container mx-auto p-4 h-screen">
      <div className="flex flex-col-reverse md:flex-row h-full relative">
        <div className="absolute top-[100vh] w-full h-full md:static md:h-full flex-1 md:pr-4">
          <DocumentUploader />
        </div>

        <div className="h-full flex-1 md:pl-4">
          <AiChat />
        </div>
      </div>
    </main>
  );
}

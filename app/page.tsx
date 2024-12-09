import AiChat from "@/components/ai-chat";
import DocumentUploader from "@/components/document-uploader";

export default function Home() {
  return (
    <main className="container mx-auto p-4 h-screen">
      <div className="flex flex-col-reverse md:flex-row h-full">
        <div className="flex-1 md:pr-4 mt-4 md:mt-0 h-[50vh] md:h-full">
          <DocumentUploader />
        </div>

        <div className="h-[50vh] md:h-full flex-1 md:pl-4">
          <AiChat />
        </div>
      </div>
    </main>
  );
}

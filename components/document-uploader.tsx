"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { processDocument } from "@/lib/rag/processing/process-document";
import { useState } from "react";
import { Input } from "./ui/input";

export default function DocumentUploader() {
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");

  const handleUpload = async () => {
    const correctPassword = process.env.PUBLIC_UPLOAD_PASSWORD;
    if (password !== correctPassword) {
      alert("Incorrect password");
      return;
    }
    try {
      await processDocument(document);
      setDocument("");
      setPassword("");
    } catch (error) {
      console.error("Error processing document:", error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Document Uploader</h2>
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 mr-2"
      />
      <Textarea
        className="flex-grow mb-4"
        placeholder="Enter your document text here..."
        value={document}
        onChange={(e) => setDocument(e.target.value)}
      />
      <Button onClick={handleUpload}>Upload Document</Button>
    </div>
  );
}
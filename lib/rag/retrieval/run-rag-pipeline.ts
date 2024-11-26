"use server";

import { getOptimizedQuery } from "./optimize-query";
import { retrieveDocuments } from "./retrieve-documents";
import { rankDocuments } from "./rerank-documents";

export async function runRagPipeline(query: string) {
    const optimizedQuery = await getOptimizedQuery(query);
    console.log("optimized query:", optimizedQuery);

    const retrievedDocuments = await retrieveDocuments(optimizedQuery, {
        limit: 15,
        minSimilarity: 0.2
    });

    console.log("Retrieved documents:", retrievedDocuments);
    console.log("Retreiedv documents count:", retrievedDocuments.length);

    const rankedResults = await rankDocuments(optimizedQuery, retrievedDocuments, 5);
    console.log("Final ranked results:", rankedResults);
    
    return rankedResults;
}
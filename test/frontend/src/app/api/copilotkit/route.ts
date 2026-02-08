import { NextRequest, NextResponse } from "next/server";
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { AdkAgent } from "./server_starter";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-copilotkit-runtime-client-gql-version",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    console.log("Copilot API triggered");

    // Get the backend URL from environment or use default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    console.log('Connecting to backend at:', backendUrl);

    // Create the agent configuration
    // The agent name should match what your backend expects
    const agents = {
      task_agent: new AdkAgent({
        url: `${backendUrl}/api/copilotkit`,
        adkBackend: backendUrl
      })
    };

    // Create runtime with the agent
    const runtime = new CopilotRuntime({
      agents,
    });

    // Setup the endpoint handler
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter: new ExperimentalEmptyAdapter(),
      endpoint: `/api/copilotkit`,
    });

    // Handle the request
    const response = await handleRequest(request);
    
    // Add CORS headers to response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error) {
    console.error("Error in copilot endpoint:", error);
    return NextResponse.json(
      {
        error: "Failed to process copilot request",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

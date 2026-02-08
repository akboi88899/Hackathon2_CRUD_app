"""Task Management Agent using Google ADK with Runner."""
from google.adk.agents import LlmAgent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from typing import Dict, List
import logging
import os
from src.prompt import AGENT_INSTRUCTION
from dotenv import load_dotenv
from src.tools import (
    create_task,
    get_all_tasks,
    update_task,
    delete_task
)

load_dotenv(override=True)
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT")
LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# App configuration
APP_NAME = "task_manager"
AGENT_NAME = "task_management_assistant"
MODEL = "gemini-2.5-flash"

# In-memory conversation history per user
user_conversations: Dict[str, List[Dict[str, str]]] = {}

# Create root agent
root_agent = LlmAgent(
    model=MODEL,
    name=AGENT_NAME,
    description="A helpful assistant that manages user tasks through CRUD operations.",
    instruction=AGENT_INSTRUCTION,
    tools=[
        create_task,
        get_all_tasks,
        update_task,
        delete_task
    ],
)

# Create session service and runner
session_service = InMemorySessionService()
runner = Runner(
    agent=root_agent,
    app_name=APP_NAME,
    session_service=session_service
)


async def run_agent(user_message: str, user_id: str) -> Dict:
    """
    Run the agent with a user message using ADK Runner.
    
    Args:
        user_message: The user's message/query
        user_id: The user's ID for context
    
    Returns:
        dict: Response containing text and success status
    """
    try:
        logger.info(f"Processing request for user {user_id}: {user_message[:100]}")
        
        # Set user_id in tools module for this request
        import src.tools as tools_module
        tools_module._request_user_id = user_id
        
        # Create unique session per user with user_id in state
        session_id = f"session_{user_id}"
        
        # Always create fresh session with user_id in state
        try:
            session = await session_service.create_session(
                app_name=APP_NAME,
                user_id=user_id,
                session_id=session_id,
                state={'user_id': user_id}  # Pass user_id in session state
            )
            logger.info(f"Created session {session_id} with user_id in state")
        except Exception as e:
            # Session may already exist, try to get it
            try:
                session = await session_service.get_session(
                    app_name=APP_NAME,
                    user_id=user_id,
                    session_id=session_id
                )
                logger.info(f"Got existing session for user {user_id}")
            except Exception as e2:
                logger.error(f"Session error: {e}, {e2}")
                raise
        
        # Create content for the message
        content = types.Content(
            role="user",
            parts=[types.Part(text=user_message)]
        )
        
        # Run agent and collect response
        final_response_text = ""
        
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=content
        ):
            # Check if this is the final response
            if event.is_final_response():
                if event.content and event.content.parts:
                    for part in event.content.parts:
                        if part.text and not part.text.isspace():
                            final_response_text += part.text.strip()
        
        # Clean up
        tools_module._request_user_id = None
        
        if not final_response_text:
            final_response_text = "Task completed successfully!"
        
        logger.info(f"Agent response: {final_response_text[:200]}")
        
        return {
            "text": final_response_text,
            "success": True
        }
        
    except Exception as e:
        logger.error(f"Error in run_agent: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        
        # Clean up
        import src.tools as tools_module
        tools_module._request_user_id = None
        
        error_str = str(e)
        
        # Check for quota exceeded
        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str or "quota" in error_str.lower():
            return {
                "text": "⚠️ I've reached my daily API limit. Please try again later.",
                "success": False,
                "error_type": "quota_exceeded"
            }
        
        # Check for API key issues
        if "API Key" in error_str or "INVALID_ARGUMENT" in error_str:
            return {
                "text": "🔑 There's an issue with the API configuration.",
                "success": False,
                "error_type": "api_key_error"
            }
        
        # Generic error
        return {
            "text": f"😔 I encountered an error: {error_str[:100]}.",
            "success": False,
            "error_type": "general_error"
        }


# Backward compatibility
task_agent = root_agent

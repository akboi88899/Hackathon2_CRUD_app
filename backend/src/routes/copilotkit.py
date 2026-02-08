"""CopilotKit endpoint for ADK agent integration."""
import logging
from src.agent import root_agent
from ag_ui_adk import ADKAgent, add_adk_fastapi_endpoint
from google.adk.sessions import InMemorySessionService
from google.adk.artifacts import InMemoryArtifactService
from google.adk.memory import InMemoryMemoryService
from google.adk.auth.credential_service.in_memory_credential_service import InMemoryCredentialService

logger = logging.getLogger(__name__)

# Create separate services for CopilotKit to avoid conflicts
copilot_session_service = InMemorySessionService()
copilot_memory_service = InMemoryMemoryService()
copilot_credential_service = InMemoryCredentialService()
copilot_artifact_service = InMemoryArtifactService()

# For testing, use a hardcoded user_id
# In production, you would get this from JWT authentication
TEST_USER_ID = "test-user-id-123"  # Will be replaced with actual user from JWT

# Set the user_id in tools module for CopilotKit requests
import src.tools as tools_module
tools_module._request_user_id = TEST_USER_ID

# Create ADK agent for CopilotKit using ag_ui_adk
task_adk_agent = ADKAgent(
    adk_agent=root_agent,
    app_name="task_manager_copilot",
    user_id=TEST_USER_ID,
    session_timeout_seconds=604800,  # 7 days
    use_in_memory_services=False,
    memory_service=copilot_memory_service,
    credential_service=copilot_credential_service,
    session_service=copilot_session_service,
    artifact_service=copilot_artifact_service,
    cleanup_interval_seconds=604800
)

# Use the helper function to add the ADK FastAPI endpoint
# This automatically handles all the CopilotKit protocol
def setup_copilotkit_routes(app):
    """Setup CopilotKit routes on the FastAPI app"""
    add_adk_fastapi_endpoint(app, task_adk_agent, path="/api/copilotkit")
    logger.info(f"CopilotKit endpoint registered at /api/copilotkit with user_id: {TEST_USER_ID}")

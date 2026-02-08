'use client'

import { CopilotKit } from '@copilotkit/react-core'
import { CopilotPopup } from '@copilotkit/react-ui'
// import '@copilotkit/react-ui/styles.css'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CopilotChatPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/signin')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <main className="h-screen w-screen bg-gray-100">
      <CopilotKit
        runtimeUrl="/api/copilotkit"
        showDevConsole={false}
        agent="task_agent"
      >
        {/* Chat UI */}
        <CopilotPopup
          labels={{
            title: '📝 Task Management Assistant',
            initial: 'Hi! I can help you manage your tasks.',
          }}
          defaultOpen={true}
          className="copilot-sidebar"
        >
          {/* Main content */}
          <div className="flex h-full items-center justify-center p-8">
            <div className="max-w-2xl text-center">
              <h1 className="mb-4 text-4xl font-bold text-gray-800">
                ✅ Task Management Assistant
              </h1>
              <p className="mb-6 text-lg text-gray-600">
                Your AI-powered task management companion powered by Google ADK.
              </p>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-3 text-xl font-semibold text-gray-700">How to Use:</h2>
                <ol className="list-inside list-decimal space-y-2 text-left text-gray-600">
                  <li>The chat sidebar is open on the right</li>
                  <li>Try saying: <code className="rounded bg-gray-100 px-2 py-1">&quot;Create a task for tomorrow&quot;</code></li>
                  <li>Or ask: <code className="rounded bg-gray-100 px-2 py-1">&quot;Show my tasks&quot;</code></li>
                  <li>Update tasks: <code className="rounded bg-gray-100 px-2 py-1">&quot;Mark the milk task as done&quot;</code></li>
                  <li>Delete tasks: <code className="rounded bg-gray-100 px-2 py-1">&quot;Delete the grocery task&quot;</code></li>
                </ol>
              </div>
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Smart Features:</strong>
                  <br />
                  • Understands natural dates (&quot;tomorrow&quot;, &quot;next Tuesday&quot;)
                  <br />
                  • Supports recurring tasks (&quot;every Monday&quot;, &quot;weekly&quot;)
                  <br />
                  • Automatic time parsing (&quot;2pm&quot;, &quot;morning&quot;)
                </p>
              </div>
              <div className="mt-4 rounded-lg bg-green-50 p-4">
                <p className="text-sm text-green-800">
                  <strong>✓ Examples:</strong>
                  <br />
                  &quot;Create task for Monday standup every Monday at 9am&quot;
                  <br />
                  &quot;Show my completed tasks&quot;
                  <br />
                  &quot;Add buy milk tomorrow afternoon&quot;
                  <br />
                  &quot;Delete all completed tasks&quot;
                </p>
              </div>
            </div>
          </div>
        </CopilotPopup>
      </CopilotKit>
    </main>
  )
}

import { OpenAIStream, StreamingTextResponse } from "ai"

import OpenAI from "openai"

// import { completion } from "litellm"
import { ensureIsLogged } from "@/lib/api/ensureAppIsLogged"
import { edgeWrapper } from "@/lib/api/edgeHelpers"

export const runtime = "edge"

const convertInputToOpenAIMessages = (input: any[]) => {
  return input.map(({ role, text, functionCall, toolCalls, name }) => {
    return {
      role: role.replace("ai", "assistant"),
      content: text,
      function_call: functionCall || undefined,
      tool_calls: toolCalls || undefined,
      name: name || undefined,
    }
  })
}

const substractPlayAllowance = async (session, supabase) => {
  const { data: profile, error } = await supabase
    .from("profile")
    .select("id, org(id, play_allowance)")
    .match({ id: session.user.id })
    .single()

  if (error) throw error

  if (profile.org?.play_allowance <= 0) {
    throw new Error(
      "No allowance left today. Wait tomorrow or upgrade to continue using the playground.",
    )
  }

  // don't await to go faster
  await supabase
    .from("org")
    .update({ play_allowance: profile.org.play_allowance - 1 })
    .eq("id", profile.org.id)
}

export default edgeWrapper(async function handler(req: Request) {
  const { session, supabase } = await ensureIsLogged(req)

  await substractPlayAllowance(session, supabase)

  const { model, run } = await req.json()

  const messages = convertInputToOpenAIMessages(run.input)

  let method

  if (model.startsWith("claude")) {
    // method = completion
  } else {
    const openai = new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: "",
    })

    method = openai.chat.completions.create.bind(openai.chat.completions)
  }

  const response = await method({
    model,
    messages,
    temperature: run.params?.temperature,
    max_tokens: run.params?.max_tokens,
    top_p: run.params?.top_p,
    top_k: run.params?.top_k,
    presence_penalty: run.params?.presence_penalty,
    frequency_penalty: run.params?.frequency_penalty,
    stop: run.params?.stop,
    functions: run.params?.functions,
    tools: run.params?.tools,
    seed: run.params?.seed,
    stream: true,
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
})

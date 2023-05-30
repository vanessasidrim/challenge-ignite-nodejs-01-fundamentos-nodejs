export async function json(request, response) {
  const buffer = []

  for await (const chunk of request) {
    buffer.push(chunk)
  }

  try {
    request.body = JSON.parse(buffer.concat().toString())
  } catch {
    request.body = null
  }

  response.setHeader('Content-Type', 'application/json')
}
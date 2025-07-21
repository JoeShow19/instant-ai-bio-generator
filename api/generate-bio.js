export default async function handler(req, res) {
  // 1. Manually read the raw request body
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  const { prompt } = JSON.parse(body);

  // 2. Call OpenAI with your secret env var
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: `Write me a catchy, fun bio for: ${prompt}` }
      ],
      max_tokens: 60
    })
  });

  const data = await response.json();

  // 3. Return only the text
  return res.status(200).json({ result: data.choices[0].message.content });
}

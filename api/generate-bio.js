export default async function handler(req, res) {
  // parse JSON body
  const { prompt } = await req.json();

  // call OpenAI
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
  // return only the text
  res.status(200).json({ result: data.choices[0].message.content });
}

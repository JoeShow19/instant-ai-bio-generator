export default async function handler(req, res) {
  try {
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }

    const { prompt } = JSON.parse(body);

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Project': process.env.OPENAI_PROJECT_ID
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a creative writing assistant who writes catchy social media bios.'
          },
          {
            role: 'user',
            content: `Write a catchy, fun bio for: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    const data = await openaiRes.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error(JSON.stringify(data));
    }

    return res.status(200).json({ result: data.choices[0].message.content });
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: err.message });
  }
}



export default async function handler(req, res) {
  try {
    // 1. Manually read the raw request body
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }
    const { prompt } = JSON.parse(body);

    // 2. Call OpenAI with your secret env var
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Write me a catchy, fun bio for: ${prompt}` }],
        max_tokens: 60
      })
    });

    const data = await openaiRes.json();

    // 3. Check for errors from OpenAI
    if (!data.choices || !data.choices[0]) {
      // Throw to be caught below
      throw new Error(JSON.stringify(data));
    }

    // 4. Return the generated bio
    return res.status(200).json({ result: data.choices[0].message.content });
  } catch (err) {
    console.error('Proxy error:', err);
    // Return the error message so we can inspect it in the browser
    res.status(500).json({ error: err.message });
  }
}


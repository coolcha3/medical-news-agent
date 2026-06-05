interface SummaryResult {
  summary: string;
  tags: string[];
}

export async function summarizeArticle(
  title: string,
  content: string
): Promise<SummaryResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return { summary: '', tags: [] };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://medical-news-agent.vercel.app',
        'X-Title': 'Medical News Agent',
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [
          {
            role: 'system',
            content: `You are a medical news summarizer. Given an article, respond ONLY with valid JSON:
{
  "summary": "2-3 sentence Korean summary of key findings and implications",
  "tags": ["3-5", "english", "lowercase", "keywords"]
}
No markdown, no extra text.`,
          },
          {
            role: 'user',
            content: `Title: ${title}\n\nContent: ${content.slice(0, 3000)}`,
          },
        ],
        max_tokens: 400,
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.error('OpenRouter error:', response.status);
      return { summary: '', tags: [] };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '{}';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { summary: '', tags: [] };

    const result = JSON.parse(jsonMatch[0]);
    return {
      summary: result.summary || '',
      tags: Array.isArray(result.tags) ? result.tags.slice(0, 5) : [],
    };
  } catch (err) {
    console.error('Summarization error:', err);
    return { summary: '', tags: [] };
  }
}

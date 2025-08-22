export async function generateAIImage(prompt: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured')
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate image')
    }

    const data = await response.json()
    return data.data[0].url
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error('Failed to generate AI image. Please check your API key and try again.')
  }
}

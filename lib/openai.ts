export async function generateAIImage(prompt: string, apiKey?: string): Promise<string> {
  const key = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY

  if (!key) {
    throw new Error('Vui lòng nhập OpenAI API key để sử dụng tính năng AI')
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
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
      const errorMessage = error.error?.message || 'Không thể tạo hình ảnh'
      
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error('API key không hợp lệ hoặc đã hết hạn')
      } else if (response.status === 429) {
        if (errorMessage.includes('billing') || errorMessage.includes('limit')) {
          throw new Error('Tài khoản OpenAI đã đạt giới hạn thanh toán. Vui lòng kiểm tra billing tại platform.openai.com')
        }
        throw new Error('Đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau.')
      } else if (response.status === 400) {
        throw new Error('Yêu cầu không hợp lệ: ' + errorMessage)
      } else if (response.status === 403) {
        throw new Error('Không có quyền truy cập. Kiểm tra API key và billing của bạn.')
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.data[0].url
  } catch (error) {
    console.error('OpenAI API Error:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Không thể tạo hình ảnh AI. Vui lòng kiểm tra API key và thử lại.')
  }
}

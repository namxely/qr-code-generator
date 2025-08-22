export async function generatePollinationsImage(prompt: string): Promise<string> {
  try {
    // Clean and encode the prompt
    const cleanPrompt = encodeURIComponent(prompt.trim().replace(/[^\w\s,.-]/g, ''))
    
    // Use simpler, faster endpoint
    const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=1024&nologo=true`
    
    // Return URL directly - Pollinations generates on-the-fly
    return imageUrl
  } catch (error) {
    console.error('Pollinations AI Error:', error)
    throw new Error('Lỗi khi tạo hình ảnh AI miễn phí. Vui lòng thử lại.')
  }
}

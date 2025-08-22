'use client'

import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Download, Wand2, Loader2, Sparkles, Image as ImageIcon, Key, Eye, EyeOff, Trash2 } from 'lucide-react'
import { generateAIImage } from '@/lib/openai'
import { generatePollinationsImage } from '@/lib/pollinations'

const styles = [
  { id: 'anime', name: 'Anime', description: 'Phong cách anime dễ thương' },
  { id: 'watercolor', name: 'Watercolor', description: 'Màu nước nghệ thuật' },
  { id: 'digital', name: 'Digital Art', description: 'Nghệ thuật số hiện đại' },
  { id: 'fantasy', name: 'Fantasy', description: 'Kỳ ảo và ma thuật' },
  { id: 'minimalist', name: 'Minimalist', description: 'Tối giản và tinh tế' },
  { id: 'neon', name: 'Neon', description: 'Ánh sáng neon rực rỡ' },
]

export default function AIImageGenerator() {
  const [qrText, setQrText] = useState('')
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(styles[0])
  const [loading, setLoading] = useState(false)
  const [aiImage, setAiImage] = useState('')
  const [finalImage, setFinalImage] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [aiProvider, setAiProvider] = useState<'openai' | 'pollinations'>('pollinations')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai-api-key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey.trim()) {
      localStorage.setItem('openai-api-key', apiKey)
    }
  }, [apiKey])

  const generateAIQR = async () => {
    if (!qrText.trim()) {
      toast.error('Vui lòng nhập nội dung cho mã QR!')
      return
    }

    // If user wants AI background
    if (prompt.trim()) {
      // Check API key only for OpenAI
      if (aiProvider === 'openai') {
        if (!apiKey.trim()) {
          toast.error('Vui lòng nhập OpenAI API key để sử dụng tính năng AI!')
          return
        }
        if (!apiKey.startsWith('sk-')) {
          toast.error('API key không hợp lệ! API key phải bắt đầu với "sk-"')
          return
        }
      }

      setLoading(true)
      try {
        // Generate AI image
        const loadingMessage = aiProvider === 'openai' ? 'Đang tạo hình ảnh AI... ✨' : 'Đang tạo hình ảnh AI miễn phí... 🆓'
        toast.loading(loadingMessage, { id: 'ai-generating' })
        
        const fullPrompt = `${prompt}, ${selectedStyle.id} style, beautiful, high quality, suitable for QR code background`
        
        let imageUrl: string
        if (aiProvider === 'openai') {
          imageUrl = await generateAIImage(fullPrompt, apiKey)
        } else {
          imageUrl = await generatePollinationsImage(fullPrompt)
        }
        
        setAiImage(imageUrl)
        toast.success('Đã tạo hình ảnh AI!', { id: 'ai-generating' })

        // Generate QR code and combine with AI image
        toast.loading('Đang kết hợp với QR code... 🎨', { id: 'combining' })
        await combineQRWithAI(qrText, imageUrl)
        toast.success('Hoàn thành! 🎉', { id: 'combining' })
      } catch (error) {
        console.error('Error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo hình ảnh AI!'
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    } else {
      // Generate simple QR code without AI background
      setLoading(true)
      try {
        toast.loading('Đang tạo QR code... 📱', { id: 'qr-generating' })
        await generateSimpleQR(qrText)
        toast.success('Đã tạo QR code! 🎉', { id: 'qr-generating' })
        setAiImage('') // Clear AI image
      } catch (error) {
        console.error('Error:', error)
        toast.error('Có lỗi xảy ra khi tạo QR code!')
      } finally {
        setLoading(false)
      }
    }
  }

  const generateSimpleQR = async (text: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 400

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 400, 400)
    gradient.addColorStop(0, '#667eea')
    gradient.addColorStop(1, '#764ba2')
    
    // Fill background with gradient
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 400, 400)

    // Add white center area for QR code
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.fillRect(50, 50, 300, 300)

    // Generate QR code
    const qrCanvas = document.createElement('canvas')
    await QRCode.toCanvas(qrCanvas, text, {
      width: 280,
      margin: 1,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff00', // transparent background
      },
      errorCorrectionLevel: 'H',
    })

    // Draw QR code on main canvas
    ctx.drawImage(qrCanvas, 60, 60)

    // Add decorative border
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 3
    ctx.strokeRect(50, 50, 300, 300)

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png')
    setFinalImage(dataUrl)
  }

  const combineQRWithAI = async (text: string, bgImageUrl: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 512
    canvas.height = 512

    // Load and draw background image
    const bgImage = new Image()
    bgImage.crossOrigin = 'anonymous'
    
    try {
      await new Promise((resolve, reject) => {
        bgImage.onload = resolve
        bgImage.onerror = reject
        bgImage.src = bgImageUrl
      })

      ctx.drawImage(bgImage, 0, 0, 512, 512)

      // Add semi-transparent overlay for better QR visibility
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      ctx.fillRect(106, 106, 300, 300)

      // Generate QR code
      const qrCanvas = document.createElement('canvas')
      await QRCode.toCanvas(qrCanvas, text, {
        width: 280,
        margin: 1,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff00', // transparent background
        },
        errorCorrectionLevel: 'H',
      })

      // Draw QR code on main canvas
      ctx.drawImage(qrCanvas, 116, 116)

      // Add decorative border
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 3
      ctx.strokeRect(106, 106, 300, 300)

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png')
      setFinalImage(dataUrl)
    } catch (error) {
      console.error('Error loading image:', error)
      throw new Error('Không thể load hình ảnh AI')
    }
  }

  const downloadImage = () => {
    if (!finalImage) return

    const link = document.createElement('a')
    link.download = 'ai-qr-code.png'
    link.href = finalImage
    link.click()
    toast.success('Đã tải xuống! 📥')
  }

  const clearApiKey = () => {
    setApiKey('')
    localStorage.removeItem('openai-api-key')
    toast.success('Đã xóa API key!')
  }

  return (
    <div className="space-y-8">
      {/* AI Provider Selection */}
      <div className="space-y-4">
        <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Chọn AI Engine
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAiProvider('pollinations')}
            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              aiProvider === 'pollinations'
                ? 'border-green-500 bg-green-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🆓</span>
              <h3 className="font-semibold text-gray-800">AI Miễn Phí</h3>
            </div>
            <p className="text-sm text-gray-600">Pollinations AI - Hoàn toàn miễn phí, không cần API key</p>
            <div className="mt-2 text-xs text-green-600 font-medium">✅ Khuyên dùng</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAiProvider('openai')}
            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              aiProvider === 'openai'
                ? 'border-purple-500 bg-purple-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💎</span>
              <h3 className="font-semibold text-gray-800">OpenAI DALL-E 3</h3>
            </div>
            <p className="text-sm text-gray-600">Chất lượng cao nhất - Cần API key và có phí</p>
            <div className="mt-2 text-xs text-orange-600 font-medium">💰 ~1,000 VNĐ/ảnh</div>
          </motion.button>
        </div>
      </div>

      {/* API Key Input - Only show for OpenAI */}
      {aiProvider === 'openai' && (
        <div className="space-y-4">
          <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-600" />
            OpenAI API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Nhập OpenAI API key của bạn... (sk-...)"
              className="w-full p-4 pr-20 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
              {apiKey && (
                <button
                  type="button"
                  onClick={clearApiKey}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Xóa API key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title={showApiKey ? "Ẩn API key" : "Hiện API key"}
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <p>💡 API key chỉ được lưu tạm thời trong phiên làm việc này và không được gửi đến server của chúng tôi.</p>
            <p>🔗 Lấy API key tại: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline">platform.openai.com/api-keys</a></p>
            <p>💳 Kiểm tra billing: <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 underline">platform.openai.com/account/billing</a></p>
          </div>
        </div>
      )}

      {/* QR Content Input */}
      <div className="space-y-4">
        <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-purple-600" />
          Nội dung QR Code
        </label>
        <input
          type="text"
          value={qrText}
          onChange={(e) => setQrText(e.target.value)}
          placeholder="Nhập URL hoặc văn bản..."
          className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300"
        />
      </div>

      {/* AI Prompt Input */}
      <div className="space-y-4">
        <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Mô tả hình ảnh AI <span className="text-sm font-normal text-gray-500">(Tùy chọn)</span>
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Để trống nếu chỉ muốn tạo QR code thường, hoặc mô tả hình ảnh bạn muốn AI tạo ra... Ví dụ: một khu vườn hoa anh đào, bầu trời xanh với mây trắng..."
          className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none resize-none transition-all duration-300 min-h-[100px]"
        />
        <p className="text-sm text-gray-600">
          💡 Bỏ trống để tạo QR code với background gradient đẹp. Nhập mô tả để tạo QR code với hình ảnh AI {aiProvider === 'pollinations' ? 'miễn phí' : 'cao cấp'}.
        </p>
      </div>

      {/* Style Selection */}
      <div className="space-y-4">
        <label className="text-lg font-semibold text-gray-700">Chọn phong cách</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {styles.map((style) => (
            <motion.button
              key={style.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedStyle(style)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedStyle.id === style.id
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-gray-800">{style.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{style.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generateAIQR}
        disabled={loading || !qrText.trim()}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang tạo...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            {prompt.trim() ? (aiProvider === 'pollinations' ? 'Tạo AI QR Code (Miễn Phí)' : 'Tạo AI QR Code') : 'Tạo QR Code'}
          </>
        )}
      </motion.button>

      {/* Result Display */}
      {finalImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* AI Image Preview */}
          {aiImage && (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Hình ảnh AI gốc</h3>
              <img
                src={aiImage}
                alt="AI Generated"
                className="mx-auto rounded-2xl shadow-lg max-w-full"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}

          {/* Final QR Code */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              {aiImage ? 'QR Code với AI' : 'QR Code'}
            </h3>
            <div className="inline-block bg-white p-4 rounded-2xl shadow-xl">
              <img
                src={finalImage}
                alt={aiImage ? 'AI QR Code' : 'QR Code'}
                className="w-[400px] h-[400px] max-w-full"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadImage}
            className="mx-auto px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Tải xuống {aiImage ? 'AI QR Code' : 'QR Code'}
          </motion.button>
        </motion.div>
      )}

      {/* Hidden canvas */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  )
}

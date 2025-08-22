'use client'

import { useState, useRef } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Download, Wand2, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react'
import { generateAIImage } from '@/lib/openai'

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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateAIQR = async () => {
    if (!qrText.trim()) {
      toast.error('Vui lòng nhập nội dung cho mã QR!')
      return
    }
    if (!prompt.trim()) {
      toast.error('Vui lòng nhập mô tả cho hình ảnh AI!')
      return
    }

    setLoading(true)
    try {
      // Generate AI image
      toast.loading('Đang tạo hình ảnh AI... ✨', { id: 'ai-generating' })
      const fullPrompt = `${prompt}, ${selectedStyle.id} style, beautiful, high quality, suitable for QR code background`
      const imageUrl = await generateAIImage(fullPrompt)
      setAiImage(imageUrl)
      toast.success('Đã tạo hình ảnh AI!', { id: 'ai-generating' })

      // Generate QR code and combine with AI image
      toast.loading('Đang kết hợp với QR code... 🎨', { id: 'combining' })
      await combineQRWithAI(qrText, imageUrl)
      toast.success('Hoàn thành! 🎉', { id: 'combining' })
    } catch (error) {
      console.error('Error:', error)
      toast.error('Có lỗi xảy ra! Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
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
  }

  const downloadImage = () => {
    if (!finalImage) return

    const link = document.createElement('a')
    link.download = 'ai-qr-code.png'
    link.href = finalImage
    link.click()
    toast.success('Đã tải xuống! 📥')
  }

  return (
    <div className="space-y-8">
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
          Mô tả hình ảnh AI
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Mô tả hình ảnh bạn muốn AI tạo ra... Ví dụ: một khu vườn hoa anh đào, bầu trời xanh với mây trắng..."
          className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none resize-none transition-all duration-300 min-h-[100px]"
        />
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
        disabled={loading || !qrText.trim() || !prompt.trim()}
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
            Tạo AI QR Code
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
            <h3 className="text-lg font-semibold text-gray-700 mb-3">QR Code với AI</h3>
            <div className="inline-block bg-white p-4 rounded-2xl shadow-xl">
              <img
                src={finalImage}
                alt="AI QR Code"
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
            Tải xuống AI QR Code
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

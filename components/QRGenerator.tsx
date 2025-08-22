'use client'

import { useState, useRef } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Download, Copy, RefreshCw, Palette, Type } from 'lucide-react'

const colors = [
  { name: 'Classic', dark: '#000000', light: '#FFFFFF' },
  { name: 'Ocean', dark: '#0077BE', light: '#E6F3FF' },
  { name: 'Sunset', dark: '#FF6B6B', light: '#FFE5E5' },
  { name: 'Forest', dark: '#2D5016', light: '#E8F5E8' },
  { name: 'Purple', dark: '#6B46C1', light: '#F3E8FF' },
  { name: 'Gold', dark: '#D97706', light: '#FEF3C7' },
]

export default function QRGenerator() {
  const [text, setText] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQR = async () => {
    if (!text.trim()) {
      toast.error('Vui lòng nhập nội dung cho mã QR!')
      return
    }

    setLoading(true)
    try {
      const canvas = canvasRef.current
      if (!canvas) return

      await QRCode.toCanvas(canvas, text, {
        width: 300,
        margin: 2,
        color: {
          dark: selectedColor.dark,
          light: selectedColor.light,
        },
        errorCorrectionLevel: 'M',
      })

      const dataUrl = canvas.toDataURL()
      setQrCode(dataUrl)
      toast.success('Tạo mã QR thành công! 🎉')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo mã QR!')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrCode) return

    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = qrCode
    link.click()
    toast.success('Đã tải xuống mã QR! 📥')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Đã sao chép nội dung! 📋')
    } catch (error) {
      toast.error('Không thể sao chép!')
    }
  }

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Type className="w-5 h-5 text-purple-600" />
          <label className="text-lg font-semibold text-gray-700">Nội dung QR Code</label>
        </div>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập URL, văn bản hoặc bất kỳ nội dung nào bạn muốn mã hóa..."
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:outline-none resize-none transition-all duration-300 min-h-[120px]"
          />
          <button
            onClick={copyToClipboard}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Copy content"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-5 h-5 text-purple-600" />
          <label className="text-lg font-semibold text-gray-700">Chọn màu sắc</label>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {colors.map((color) => (
            <motion.button
              key={color.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedColor(color)}
              className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                selectedColor.name === color.name
                  ? 'border-purple-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: color.dark }}
                />
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color.light }}
                />
              </div>
              <p className="text-xs mt-1 text-gray-600">{color.name}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={generateQR}
        disabled={loading || !text.trim()}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Đang tạo...
          </>
        ) : (
          <>
            <RefreshCw className="w-5 h-5" />
            Tạo QR Code
          </>
        )}
      </motion.button>

      {/* QR Code Display */}
      {qrCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto"
              style={{ display: qrCode ? 'block' : 'none' }}
            />
            {qrCode && (
              <img
                src={qrCode}
                alt="QR Code"
                className="w-[300px] h-[300px]"
              />
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadQR}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Tải xuống QR Code
          </motion.button>
        </motion.div>
      )}

      {/* Hidden canvas for QR generation */}
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        style={{ display: 'none' }}
      />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import QRGenerator from '@/components/QRGenerator'
import AIImageGenerator from '@/components/AIImageGenerator'
import { Sparkles, Zap, Heart } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'qr' | 'ai'>('qr')

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4 flex items-center justify-center gap-2">
            AI QR Code Generator <Sparkles className="w-10 h-10 text-yellow-500" />
          </h1>
          <p className="text-gray-600 text-lg">Tạo mã QR độc đáo với sức mạnh của AI ✨</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="glass rounded-full p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('qr')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'qr'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="w-4 h-4" />
              QR Code
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'ai'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className="w-4 h-4" />
              AI + QR
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'qr' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          {activeTab === 'qr' ? <QRGenerator /> : <AIImageGenerator />}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12 text-gray-600"
        >
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> using Next.js & AI
          </p>
        </motion.footer>
      </div>
    </main>
  )
}

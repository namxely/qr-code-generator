import gradio as gr
import subprocess
import os
import sys
import time
import threading
import requests
from pathlib import Path

def start_nextjs_server():
    """Start Next.js development server"""
    try:
        # Install dependencies
        subprocess.run(["npm", "install"], check=True, capture_output=True)
        
        # Build the app
        subprocess.run(["npm", "run", "build"], check=True, capture_output=True)
        
        # Start the server in background
        process = subprocess.Popen(
            ["npm", "start"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait a bit for server to start
        time.sleep(10)
        
        return process
    except Exception as e:
        print(f"Error starting server: {e}")
        return None

def create_iframe_interface():
    """Create Gradio interface with iframe to Next.js app"""
    
    # Start Next.js server
    server_process = start_nextjs_server()
    
    # Create iframe HTML
    iframe_html = """
    <div style="width: 100%; height: 800px; border: none;">
        <iframe 
            src="http://localhost:3000" 
            width="100%" 
            height="100%" 
            frameborder="0"
            style="border: none; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
        >
        </iframe>
    </div>
    """
    
    return iframe_html

# Create Gradio interface
demo = gr.Interface(
    fn=create_iframe_interface,
    inputs=[],
    outputs=gr.HTML(),
    title="🤖 AI QR Code Generator",
    description="""
    ## 🚀 Tạo QR Code độc đáo với AI - Hoàn toàn miễn phí!
    
    ### ✨ Tính năng:
    - 🆓 **AI Miễn Phí** - Sử dụng Pollinations AI (không cần API key)
    - 💎 **AI Premium** - Tùy chọn OpenAI DALL-E 3 (có phí)
    - 🎨 **6 phong cách nghệ thuật** - Anime, Watercolor, Digital Art, Fantasy, Minimalist, Neon
    - 📱 **Responsive Design** - Hoạt động tốt trên mọi thiết bị
    - 💾 **Tải xuống** QR code chất lượng cao
    
    ### 🎯 Cách sử dụng:
    1. Chọn AI Engine (Miễn phí hoặc Premium)
    2. Nhập nội dung QR code (URL, text, etc.)
    3. Mô tả hình ảnh AI (tùy chọn)
    4. Chọn phong cách nghệ thuật
    5. Tạo và tải xuống!
    
    ### 🌟 Hoàn toàn miễn phí và không cần đăng ký!
    """,
    theme=gr.themes.Soft(),
    css="""
    .gradio-container {
        max-width: 1200px !important;
    }
    """
)

# Launch the app
if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=True,
        show_error=True
    )

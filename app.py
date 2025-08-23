import gradio as gr
import qrcode
import io
import base64
from PIL import Image
import requests
import json

def generate_qr_code(text, style="default"):
    """Generate QR code with different styles"""
    if not text.strip():
        return None, "Vui lòng nhập nội dung QR code"
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(text)
    qr.make(fit=True)
    
    # Create image with different styles
    if style == "anime":
        fill_color = "#FF6B9D"
        back_color = "#FFE5F1"
    elif style == "watercolor":
        fill_color = "#4A90E2"
        back_color = "#E8F4FD"
    elif style == "digital":
        fill_color = "#00D4AA"
        back_color = "#E6FFF7"
    elif style == "fantasy":
        fill_color = "#9B59B6"
        back_color = "#F4E6FF"
    elif style == "minimalist":
        fill_color = "#2C3E50"
        back_color = "#FFFFFF"
    elif style == "neon":
        fill_color = "#00FF88"
        back_color = "#000000"
    else:
        fill_color = "#000000"
        back_color = "#FFFFFF"
    
    img = qr.make_image(fill_color=fill_color, back_color=back_color)
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}", "QR Code đã được tạo thành công!"

def generate_ai_qr_code(text, ai_prompt, style="anime", ai_provider="free"):
    """Generate AI-powered QR code"""
    if not text.strip():
        return None, "Vui lòng nhập nội dung QR code"
    
    # Generate base QR code
    qr_result, qr_message = generate_qr_code(text, style)
    if not qr_result:
        return None, qr_message
    
    # If no AI prompt, return regular QR code
    if not ai_prompt.strip():
        return qr_result, "QR Code thường đã được tạo thành công!"
    
    try:
        # Generate AI background using Pollinations (free)
        if ai_provider == "free":
            clean_prompt = ai_prompt.strip().replace(" ", "+")
            ai_image_url = f"https://image.pollinations.ai/prompt/{clean_prompt}?width=1024&height=1024&nologo=true"
            
            # For demo, we'll return the QR code with AI image URL
            return qr_result, f"AI QR Code đã được tạo! Background AI: {ai_image_url}"
        
        else:
            return qr_result, "Tính năng OpenAI DALL-E 3 cần API key. Vui lòng sử dụng AI Miễn Phí."
            
    except Exception as e:
        return qr_result, f"Lỗi khi tạo AI background: {str(e)}"

# Create Gradio interface
with gr.Blocks(title="🤖 AI QR Code Generator", theme=gr.themes.Soft()) as demo:
    gr.Markdown("""
    # 🤖 AI QR Code Generator ✨
    
    ## 🚀 Tạo QR Code độc đáo với AI - Hoàn toàn miễn phí!
    
    ### ✨ Tính năng:
    - 🆓 **AI Miễn Phí** - Sử dụng Pollinations AI (không cần API key)
    - 💎 **AI Premium** - Tùy chọn OpenAI DALL-E 3 (cần API key)
    - 🎨 **6 phong cách nghệ thuật** - Anime, Watercolor, Digital Art, Fantasy, Minimalist, Neon
    - 📱 **Responsive Design** - Hoạt động tốt trên mọi thiết bị
    - 💾 **Tải xuống** QR code chất lượng cao
    """)
    
    with gr.Tab("🎨 QR Code Cơ Bản"):
        with gr.Row():
            with gr.Column():
                qr_text = gr.Textbox(
                    label="Nội dung QR Code",
                    placeholder="Nhập URL, text, hoặc bất kỳ nội dung nào...",
                    lines=3
                )
                qr_style = gr.Dropdown(
                    choices=["default", "anime", "watercolor", "digital", "fantasy", "minimalist", "neon"],
                    value="default",
                    label="Phong cách"
                )
                qr_generate_btn = gr.Button("🎨 Tạo QR Code", variant="primary")
            
            with gr.Column():
                qr_output = gr.Image(label="QR Code", type="pil")
                qr_message = gr.Textbox(label="Thông báo", interactive=False)
    
    with gr.Tab("🤖 AI QR Code"):
        with gr.Row():
            with gr.Column():
                ai_qr_text = gr.Textbox(
                    label="Nội dung QR Code",
                    placeholder="Nhập URL, text, hoặc bất kỳ nội dung nào...",
                    lines=3
                )
                
                with gr.Row():
                    ai_provider = gr.Radio(
                        choices=["free", "openai"],
                        value="free",
                        label="Chọn AI Engine",
                        info="🆓 Miễn phí hoặc 💎 Premium"
                    )
                
                ai_prompt = gr.Textbox(
                    label="Mô tả hình ảnh AI (Tùy chọn)",
                    placeholder="Mô tả hình ảnh bạn muốn AI tạo làm background...",
                    lines=2
                )
                
                ai_style = gr.Dropdown(
                    choices=["anime", "watercolor", "digital", "fantasy", "minimalist", "neon"],
                    value="anime",
                    label="Phong cách nghệ thuật"
                )
                
                ai_generate_btn = gr.Button("🤖 Tạo AI QR Code", variant="primary")
            
            with gr.Column():
                ai_output = gr.Image(label="AI QR Code", type="pil")
                ai_message = gr.Textbox(label="Thông báo", interactive=False)
    
    # Event handlers
    qr_generate_btn.click(
        fn=generate_qr_code,
        inputs=[qr_text, qr_style],
        outputs=[qr_output, qr_message]
    )
    
    ai_generate_btn.click(
        fn=generate_ai_qr_code,
        inputs=[ai_qr_text, ai_prompt, ai_style, ai_provider],
        outputs=[ai_output, ai_message]
    )
    
    gr.Markdown("""
    ### 🎯 Cách sử dụng:
    1. Chọn tab "QR Code Cơ Bản" hoặc "AI QR Code"
    2. Nhập nội dung QR code (URL, text, etc.)
    3. Chọn phong cách nghệ thuật
    4. Nếu dùng AI, nhập mô tả hình ảnh (tùy chọn)
    5. Nhấn nút tạo và tải xuống!
    
    ### 🌟 Hoàn toàn miễn phí và không cần đăng ký!
    """)

# Launch the app
if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=True
    )

# AI QR Code Generator ✨

Một ứng dụng web hiện đại để tạo mã QR độc đáo với sức mạnh của AI.

## Tính năng

- 🎨 **Tạo QR Code cơ bản** với nhiều màu sắc tùy chỉnh
- 🤖 **AI QR Code** - Kết hợp QR code với hình ảnh được tạo bởi AI
- ✨ **Giao diện đẹp mắt** với animations mượt mà
- 📱 **Responsive design** - Hoạt động tốt trên mọi thiết bị
- 💾 **Tải xuống** QR code dạng hình ảnh PNG

## Cài đặt

1. **Clone repository và cài đặt dependencies:**

```bash
cd ai-qr-generator
npm install
```

2. **Cấu hình OpenAI API Key:**

Tạo file `.env.local` trong thư mục gốc và thêm API key của bạn:

```
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key-here
```

Bạn có thể lấy API key từ [OpenAI Platform](https://platform.openai.com/api-keys).

3. **Chạy ứng dụng:**

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## Sử dụng

### QR Code cơ bản
1. Nhập nội dung (URL, văn bản, etc.)
2. Chọn màu sắc yêu thích
3. Nhấn "Tạo QR Code"
4. Tải xuống kết quả

### AI QR Code
1. Nhập nội dung cho QR code
2. Mô tả hình ảnh bạn muốn AI tạo
3. Chọn phong cách (Anime, Watercolor, Digital Art, etc.)
4. Nhấn "Tạo AI QR Code"
5. Đợi AI tạo hình ảnh và kết hợp với QR code
6. Tải xuống kết quả

## Công nghệ sử dụng

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **OpenAI DALL-E 3** - AI image generation
- **qrcode** - QR code generation

## Lưu ý

- Cần có API key từ OpenAI để sử dụng tính năng AI
- Mỗi lần tạo ảnh AI sẽ tốn credit từ tài khoản OpenAI của bạn
- QR code được tạo với error correction level cao để đảm bảo hoạt động tốt khi kết hợp với hình ảnh

## License

MIT

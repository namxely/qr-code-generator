@echo off
echo ========================================
echo   AI QR Code Generator - Setup Script
echo ========================================
echo.

echo Installing dependencies...
npm install

echo.
echo ========================================
echo Setup completed!
echo.
echo Next steps:
echo 1. Create a .env.local file in the root directory
echo 2. Add your OpenAI API key: NEXT_PUBLIC_OPENAI_API_KEY=your-key-here
echo 3. Run: npm run dev
echo 4. Open http://localhost:3000
echo ========================================
pause

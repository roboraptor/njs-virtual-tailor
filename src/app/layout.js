// app/layout.js
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css"; // Tvoje vlastní styly

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
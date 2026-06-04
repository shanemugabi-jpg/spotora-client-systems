import "./globals.css";

export const metadata = {
  title: "Zone 7",
  description: "QR Ordering by Spotora",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

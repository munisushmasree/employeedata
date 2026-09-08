import "./globals.css";

export const metadata = {
  title: "Employee Offboarding",
  description: "Employee Offboarding Automation System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
import Sidebar from "@/components/sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <div className="ml-[266px] mt-[64px] p-5 max-md:ml-[100px]">
          {children}
        </div>
      </body>
    </html>
  );
}

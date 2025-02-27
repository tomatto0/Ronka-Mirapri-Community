import "../globals.css";
import Navigation from "../components/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-container">
      <div className="header">
        <Navigation />
      </div>
      {children}
    </div>
  );
}

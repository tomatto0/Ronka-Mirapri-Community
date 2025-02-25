import "../globals.css";
import Navigation from "../components/Navigation";

export const metadata: Metadata = {
  title: "Ronka Lookbook",
  description: "모험가를 위한 투영기록장",
};

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

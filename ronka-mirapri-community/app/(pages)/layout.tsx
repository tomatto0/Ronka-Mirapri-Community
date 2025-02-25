import "../globals.css";
import Navigation from "../components/Navigation";

// export const metadata: Metadata = {
//   title: "DashBunny - 가게관리",
//   description: "판매되는 메뉴와 메뉴그룹을 설정할 수 있습니다",
// };

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

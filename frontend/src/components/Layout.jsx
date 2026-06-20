import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div>
      <Sidebar />

      <div>
        <Header />
        {children}
      </div>
    </div>
  );
}
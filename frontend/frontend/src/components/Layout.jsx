import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ activePage, setActivePage, theme, toggleTheme, downloadReport, children }) {
  return (
    <div className="flex min-h-screen w-full max-w-[1440px] mx-auto">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 min-w-0 px-4 md:pr-4 md:pl-0 pb-24 md:pb-4 pt-4">
        <Header
          activePage={activePage}
          theme={theme}
          toggleTheme={toggleTheme}
          downloadReport={downloadReport}
        />
        <main className="flex flex-col gap-5">{children}</main>
      </div>
    </div>
  );
}

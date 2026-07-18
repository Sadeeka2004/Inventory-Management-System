import type { ReactNode } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {

  children: ReactNode;

}

function Layout({

  children

}: LayoutProps) {

  return (

    <div>

      <Header />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-6 bg-gray-50 min-h-screen">

          {children}

        </main>

      </div>

    </div>

  );

}

export default Layout;
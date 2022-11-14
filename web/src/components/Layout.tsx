import React from 'react';
import Navbar from './Navbar';


const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <div className="bg-black min-h-screen text-white items-center justify-center flex flex-col">
      <div className="flex min-h-screen w-[1200px] flex-col space-y-4 rounded-md p-4">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default Layout
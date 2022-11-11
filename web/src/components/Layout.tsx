import React from 'react';


const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <div className="bg-black min-h-screen text-white items-center justify-center flex flex-col">
      {children}
    </div>
  );
};

export default Layout
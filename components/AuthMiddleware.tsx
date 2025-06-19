'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getToken } from '@/config/token';

const AuthMiddleware = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const token = getToken();
  const pathName = usePathname()

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {

    if (!token) {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [router, pathName, token]);


  //   console.log("token, isLoading",isLoading,token);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        {/* <p>Loading...</p> */}
        <span className="loader"></span>
      </div>
    );
  }

  return (<>{children}</>);
};

export default AuthMiddleware;

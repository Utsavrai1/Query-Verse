// hoc/withAdminAuth.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/zustand/auth";

const withAdminAuth = (WrappedComponent: React.ComponentType) => {
  const WithAdminAuth = (props: any) => {
    const navigator = useNavigate();
    const { isAdmin } = useAuthStore();

    React.useEffect(() => {
      if (!isAdmin) {
        navigator("/");
      }
    }, [isAdmin, history]);

    return <WrappedComponent {...props} />;
  };

  return WithAdminAuth;
};

export default withAdminAuth;

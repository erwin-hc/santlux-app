import * as React from "react";
import { useSession } from "next-auth/react";

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const { data: session } = useSession();

  React.useEffect(() => {
    if (session?.user) {
      const adminStatus = Number(session.user.isAdmin) === 1;
      setIsAdmin(adminStatus);
    }
  }, [session]);

  return isAdmin;
}

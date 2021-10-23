/* eslint-disable promise/always-return */
import * as React from "react";
import { useRouter } from "next/router";
import { getSessionUser } from "lib/auth";
import { cad as CAD, User } from "types/prisma";
import { Loader } from "components/Loader";
import { useIsFeatureEnabled } from "lib/utils";
import { useListener } from "@casper124578/use-socket.io";
import { SocketEvents } from "@snailycad/config";

interface Context {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  cad: CAD | null;
  setCad: React.Dispatch<React.SetStateAction<CAD | null>>;
}

const AuthContext = React.createContext<Context | undefined>(undefined);

interface ProviderProps {
  children: React.ReactChild | React.ReactChild[];
  initialData: { session?: User | null };
}

export const AuthProvider = ({ initialData, children }: ProviderProps) => {
  const [user, setUser] = React.useState<User | null>(initialData.session ?? null);
  const [cad, setCad] = React.useState<CAD | null>(null);
  const router = useRouter();

  const isEnabled = useIsFeatureEnabled(cad ?? {});

  const handleGetUser = React.useCallback(async () => {
    getSessionUser()
      .then((u) => {
        if (!u && !router.asPath.includes("/auth")) {
          router.push("/auth/login");
        }

        setUser(u);
      })
      .catch(() => void 0);
  }, [router]);

  React.useEffect(() => {
    _setBodyTheme(user?.isDarkTheme ?? true);
  }, [user?.isDarkTheme]);

  React.useEffect(() => {
    handleGetUser();
  }, [handleGetUser]);

  React.useEffect(() => {
    if (initialData.session) {
      setUser(initialData.session);

      if ("cad" in initialData.session) {
        // @ts-expect-error ignore
        setCad(initialData.session.cad);
      }
    }
  }, [initialData.session]);

  useListener(
    SocketEvents.UserBanned,
    (userId) => {
      if (userId !== user?.id) return;
      router.push("/auth/login?error=banned");
    },
    [user?.id],
  );

  const value = { user, cad, setCad, setUser };

  if (!router.pathname.includes("auth") && !user) {
    return (
      <div id="unauthorized" className="fixed inset-0 grid place-items-center">
        <span aria-label="loading...">
          <Loader className="w-14 h-14 border-[3px]" />
        </span>
      </div>
    );
  }

  if (cad && !isEnabled) {
    return (
      <main className="grid place-items-center h-screen">
        <p>Feature is not enabled.</p>
      </main>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (typeof context === "undefined") {
    throw new Error("`useAuth` must be used within an `AuthProvider`");
  }

  return context;
}

function _setBodyTheme(isDarkTheme: boolean) {
  if (!isDarkTheme) return;
  if (typeof window === "undefined") return;

  true;
  // window.document.body.classList.add("dark");
}

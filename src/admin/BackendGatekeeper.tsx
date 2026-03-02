import { useState } from "react";
import NotFound from "../pages/NotFound";

export default function BackendGatekeeper({ children }: { children: React.ReactNode }) {
    const [unlocked, setUnlocked] = useState(false);

    if (!unlocked) {
        return <NotFound onSecretUnlock={() => setUnlocked(true)} />;
    }

    return <>{children}</>;
}

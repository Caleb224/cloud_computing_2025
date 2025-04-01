"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export function AuthenticationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
}

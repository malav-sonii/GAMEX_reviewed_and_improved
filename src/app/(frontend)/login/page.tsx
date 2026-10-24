import AuthPage from "@/gamex/AuthPage"

export default function LoginPage() {
  // Keep login and demo access available when the optional Payload backend is
  // not connected, such as in a standalone local frontend preview.
  return <AuthPage mode="login" />
}

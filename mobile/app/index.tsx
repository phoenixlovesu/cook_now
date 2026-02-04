import { Redirect } from 'expo-router';

export default function Entry() {
  // Always shows onboarding when user opens app (temporary)
  return <Redirect href="./onboarding" />;
}

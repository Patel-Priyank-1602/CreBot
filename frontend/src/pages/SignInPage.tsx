import { SignIn } from '@clerk/clerk-react';
import AuthLayout from '../components/layout/AuthLayout';

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome back to your CreBot account."
      subtitle="Sign in to manage your chatbots, upload files, and connect your knowledge to real conversations."
    >
      <SignIn signUpUrl="/signup" />
    </AuthLayout>
  );
}

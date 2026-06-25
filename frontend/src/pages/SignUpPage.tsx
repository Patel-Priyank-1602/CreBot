import { SignUp } from '@clerk/clerk-react';
import AuthLayout from '../components/layout/AuthLayout';

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your CreBot account."
      subtitle="Sign up to build intelligent chatbots from your documents and deploy them anywhere."
    >
      <SignUp signInUrl="/login" />
    </AuthLayout>
  );
}

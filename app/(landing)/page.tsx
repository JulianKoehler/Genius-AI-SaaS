import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div>
      LandingPage (Unprotected)
      <div>
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Register</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="link">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;

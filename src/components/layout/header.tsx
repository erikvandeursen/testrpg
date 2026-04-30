import { Link } from "react-router-dom";
import { LoginButton } from "@/components/login/login-button";

export default function Header() {
  return (
    <header data-testid="site-header" className="sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between w-full h-14 px-2 md:px-12 bg-blue-500">
        <Link data-testid="home-link" to="/">
          <span className="text-white font-extrabold">TestRPG</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            data-testid="api-link"
            to="/api"
            className="text-white text-sm font-medium hover:underline"
          >
            API
          </Link>
          <LoginButton />
          <a
            data-testid="testcoders-link"
            href="https://www.testcoders.nl/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/testcoders.svg" width={80} height={80} alt="TestCoders logo" />
          </a>
        </nav>
      </div>
    </header>
  );
}

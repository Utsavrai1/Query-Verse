import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { useAuthStore } from "@/zustand/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
  FaExclamationCircle,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import { MenuIcon } from "lucide-react";

const Header: React.FC = () => {
  const { token, clearToken, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-10 bg-zinc-50 dark:bg-zinc-950">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center dark:bg-zinc-950 dark:text-zinc-50">
        <Link to="/" className="text-2xl font-bold">
          Query Verse
        </Link>
        <ul className="flex space-x-4 items-center">
          {token ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <MenuIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {isAdmin && (
                    <DropdownMenuItem
                      onClick={() => {
                        navigate("/admin");
                      }}
                    >
                      <span className="mr-2">
                        <FaUserShield />
                      </span>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/pending");
                    }}
                  >
                    <span className="mr-2">
                      <FaExclamationCircle />
                    </span>
                    Pending Questions
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/all");
                    }}
                  >
                    <span className="mr-2">
                      <FaExclamationCircle />
                    </span>
                    My Questions
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/ask");
                    }}
                  >
                    <span className="mr-2">
                      <FaQuestionCircle />
                    </span>
                    Ask Question
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <li>
                <Button variant="ghost" onClick={handleLogout}>
                  <FaSignOutAlt />
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </li>
              <li>
                <Button variant="ghost" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </li>
            </>
          )}
          <li>
            <ModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

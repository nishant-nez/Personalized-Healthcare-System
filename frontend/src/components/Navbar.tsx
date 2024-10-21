import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SVGProps } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import VerticalNav from "./VerticalNav";
import Logo from "@/assets/healthcare-logo.svg";
import LogoDark from "@/assets/healthcare-logo-dark.svg";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "@/contexts/theme-provider";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Hospitals", to: "/hospitals" },
  { label: "Blogs", to: "/blogs" },
];

const AUTH_LINKS = [
  { label: "Diagnosis History", to: "/history" },
  { label: "Medicine Reminders", to: "/reminders" },
];

const Navbar = () => {
  const { logout, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const logout_user = () => {
    logout();
    navigate('/');
  }

  const theme = useTheme().theme;

  return (
    <>
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 bg-white dark:bg-gray-900 fixed top-0 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6 text-black dark:text-white" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="dark:bg-gray-800">
            <Link to={'/'} >
              <img src={document.documentElement.classList.contains('dark') ? LogoDark : Logo} alt="Healthcare Logo" className="h-6 w-6" />
              <span className="sr-only">Healthcare</span>
            </Link>
            <div className="grid gap-2 py-6">
              {LINKS.map((link) =>
                <Link to={link.to} key={link.to} className="flex w-full items-center py-2 text-lg font-semibold text-black dark:text-white" >
                  {link.label}
                </Link>
              )}
              {isLoggedIn &&
                <>
                  {AUTH_LINKS.map((link) =>
                    <Link to={link.to} key={link.to} className="flex w-full items-center py-2 text-lg font-semibold text-black dark:text-white" >
                      {link.label}
                    </Link>
                  )}
                </>
              }
            </div>
          </SheetContent>
        </Sheet>
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <Link to={'/'} className="mr-6 hidden lg:flex" >
              <img src={theme === 'dark' ? LogoDark : Logo} alt="Healthcare Logo" className="h-6 w-6" />
              <span className="sr-only">Healthcare</span>
            </Link>
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {LINKS.map((link) =>
                  <Link
                    to={link.to}
                    key={link.to}
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-black dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-300 focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-gray-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 dark:data-[active]:bg-gray-700/50 data-[state=open]:bg-gray-100/50 dark:data-[state=open]:bg-gray-700/50"
                  >
                    {link.label}
                  </Link>
                )}
                {isLoggedIn &&
                  <>
                    {AUTH_LINKS.map((link) =>
                      <Link
                        to={link.to}
                        key={link.to}
                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-black dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-300 focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-gray-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 dark:data-[active]:bg-gray-700/50 data-[state=open]:bg-gray-100/50 dark:data-[state=open]:bg-gray-700/50"
                      >
                        {link.label}
                      </Link>
                    )}
                  </>
                }
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {isLoggedIn
            ?
            <div className="flex gap-3 items-center cursor-pointer">
              <ModeToggle />
              <Sheet>
                <SheetTrigger>
                  <div className="flex gap-3 justify-center items-center">
                    <p className="font-semibold text-black dark:text-white">{user?.first_name}</p>
                    <Avatar>
                      <AvatarImage src={user?.image} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                </SheetTrigger>
                <SheetContent className="dark:bg-gray-800">
                  <SheetHeader>
                  </SheetHeader>
                  <VerticalNav logout={logout_user} />
                </SheetContent>
              </Sheet>
            </div>
            :
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Link to={'/login'}>
                <Button variant="outline" className="text-black dark:text-black dark:bg-white">Login</Button>
              </Link>
              <Link to={'/signup'}>
                <Button className="text-white dark:text-black dark:bg-white">Signup</Button>
              </Link>
            </div>
          }

        </div>
      </header>
    </>
  )
};

export default Navbar;

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-black dark:text-white"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

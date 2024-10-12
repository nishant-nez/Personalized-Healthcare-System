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

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Hospitals", to: "/hospital" },
  { label: "Blogs", to: "/blogs" },
];

const AUTH_LINKS = [
  { label: "My History", to: "/history" },
];

const Navbar = () => {
  const { logout, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const logout_user = () => {
    logout();
    navigate('/');
  }

  return (
    <>
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link to={'/'} >
              <MountainIcon className="h-6 w-6" />
              <span className="sr-only">Company Logo</span>
            </Link>
            <div className="grid gap-2 py-6">
              {LINKS.map((link) =>
                <Link to={link.to} key={link.to} className="flex w-full items-center py-2 text-lg font-semibold" >
                  {link.label}
                </Link>
              )}
              {isLoggedIn &&
                <>
                  {AUTH_LINKS.map((link) =>
                    <Link to={link.to} key={link.to} className="flex w-full items-center py-2 text-lg font-semibold" >
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
              <MountainIcon className="h-6 w-6" />
              <span className="sr-only">Company Logo</span>
            </Link>
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>

                {/* map */}
                {LINKS.map((link) =>
                  <Link
                    to={link.to}
                    key={link.to}
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50"
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
                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50"
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
            <div className="flex gap-3 cursor-pointer">
              <Sheet>
                <SheetTrigger>
                  <div className="flex gap-3 justify-center items-center">
                    <p className="font-semibold">{user?.first_name}</p>
                    <Avatar>
                      <AvatarImage src={user?.image} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    {/* <SheetTitle>Hello, {user?.first_name}</SheetTitle> */}
                  </SheetHeader>
                  <VerticalNav logout={logout_user} />
                </SheetContent>
              </Sheet>
            </div>
            :
            <div className="flex gap-4">
              <Link to={'/login'}>
                <Button variant="outline">Login</Button>
              </Link>
              <Link to={'/signup'}>
                <Button>Signup</Button>
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
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function MountainIcon(props: SVGProps<SVGSVGElement>) {
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
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SVGProps } from "react";


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
              <Link to={'/'} className="flex w-full items-center py-2 text-lg font-semibold" >
                Home
              </Link>
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
                <NavigationMenuLink asChild>
                  <Link
                    to={'/'}
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50"
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
                {/* map */}
                <NavigationMenuLink asChild>
                  <Link
                    to={'/hospitals'}
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50"
                  >
                    Hospitals
                  </Link>
                </NavigationMenuLink>
                {isLoggedIn &&
                  <>
                    <NavigationMenuLink asChild>
                      <Link
                        to={'/'}
                        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50"
                      >
                        History
                      </Link>
                    </NavigationMenuLink>

                  </>
                }
              </NavigationMenuList>

            </NavigationMenu>
          </div>

          {isLoggedIn
            ?
            <div className="flex gap-3 cursor-pointer">
              <Button onClick={logout_user}>Logout</Button>
              <Avatar>
                <AvatarImage src={user?.image} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
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

      {/* <div>Navbar - {user && (user.first_name + ' ' + user.email)}</div>
      <div>
        <Link to={'/'}>Home</Link>

        {isLoggedIn ? authLinks() : guestLinks()}

      </div> */}
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
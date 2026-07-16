"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { SignDialog } from "./auth/sign-dialog";
import { authClient } from "@/lib/auth-client";
import { AvatarDropdown } from "./avatar-dropdown";
import { SignTypes, useAuthDialogStore } from "@/store/useAuthDialogStore";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { SearchBar } from "./searchbar";



export const Navbar = () => {
  const { onSignTypeChange, openDialog } = useAuthDialogStore();

  const openSignDialog = (type: SignTypes) => {
    onSignTypeChange(type);
    openDialog();
  };

  const { data: session } = authClient.useSession();

  return (
    <>
      <nav className="w-full flex justify-center fixed top-0 left-0 right-0 z-50 bg-linear-to-b from-background to-transparent backdrop-blur-md ">
        <div className="container flex p-6">
          <div className="flex gap-4 w-full justify-between">
            <div>
              <h1 className="text-2xl font-extrabold">
                INPUT<span className="text-emerald-700">G</span>
              </h1>
            </div>
            <div className="hidden self-end md:flex items-center gap-4">
              <SearchBar />
              <div className="flex items-center">
                <NavigationMenu>
                  <NavigationMenuList className={"gap-3"}>
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        render={<Link href="/games">GAMES</Link>}
                      />
                    </NavigationMenuItem>
                    {!session ? (
                      <>
                        <NavigationMenuItem>
                          <Button
                            variant={"link"}
                            onClick={() => openSignDialog(SignTypes.SIGNIN)}
                          >
                            SIGN IN
                          </Button>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <Button
                            variant={"default"}
                            size={"lg"}
                            onClick={() => openSignDialog(SignTypes.SIGNUP)}
                          >
                            CREATE ACCOUNT
                          </Button>
                        </NavigationMenuItem>
                      </>
                    ) : (
                      <>
                        <NavigationMenuItem>
                          <AvatarDropdown />
                        </NavigationMenuItem>
                      </>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>
            <div className="block md:hidden">
              <Sheet>
                <SheetTrigger>
                  <Menu />
                </SheetTrigger>
                <SheetContent className={"h-full"}>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 px-4 py-4 h-full">
                    <Link href="/games" className="font-bold">
                      GAMES
                    </Link>

                    <SearchBar />
                    <Separator />
                    {!session ? (
                      <div className="grow flex flex-col justify-end gap-2">
                        <Button
                          className={"w-full"}
                          size={"lg"}
                          onClick={() => openSignDialog(SignTypes.SIGNIN)}
                        >
                          Sign-In
                        </Button>
                        <Button
                          className={"w-full"}
                          size={"lg"}
                          variant={"secondary"}
                          onClick={() => openSignDialog(SignTypes.SIGNUP)}
                        >
                          Create Account
                        </Button>
                      </div>
                    ) : (
                      <div className="grow flex flex-col justify-end gap-2 self-end">
                        <AvatarDropdown size="lg" />
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
      <SignDialog />
    </>
  );
};

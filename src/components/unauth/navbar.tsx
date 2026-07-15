"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useState } from "react";
import { SignDialog, SignTypes } from "./auth/sign-dialog";
import { authClient } from "@/lib/auth-client";
import { AvatarDropdown } from "./avatar-dropdown";

export const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [signOpen, setSignOpen] = useState(false);

  const [signType, setSignType] = useState<SignTypes>(SignTypes.SIGNIN);

  const openSignDialog = (type: SignTypes) => {
    setSignType(type);
    setSignOpen(true);
  };

  const { data: session } = authClient.useSession();

  return (
    <>
      <nav className="w-full flex justify-center">
        <div className="container flex p-6">
          <div className="flex gap-4 w-full justify-between">
            <div>
              <h1 className="text-2xl font-extrabold">
                INPUT<span className="text-emerald-700">G</span>
              </h1>
            </div>
            <div className="self-end flex items-center gap-4">
              <Command className="relative">
                <CommandInput
                  placeholder="Search for a game..."
                  value={searchValue}
                  onValueChange={setSearchValue}
                  className="w-72"
                />
                {searchValue && (
                  <CommandList>
                    <CommandList>
                      <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

                      <CommandGroup heading="Sugestões">
                        <CommandItem>Minha Conta</CommandItem>
                        <CommandItem>Projetos</CommandItem>
                        <CommandItem>Configurações</CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </CommandList>
                )}
              </Command>
              <div>
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
          </div>
        </div>
      </nav>
      <SignDialog
        open={signOpen}
        onOpenChange={setSignOpen}
        signType={signType}
        onSignTypeChange={setSignType}
      />
    </>
  );
};

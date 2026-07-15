import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

export const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  return (
    <Command className="relative">
      <CommandInput
        placeholder="Search for a game..."
        value={searchValue}
        onValueChange={setSearchValue}
        className="w-full md:w-72"
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
  );
};
